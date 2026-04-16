prompt: I want you to do an in-depth review file-manger module under src with 5 subagents and help me identify any implementation issues or code quaility problems. output a list of all of your findings with a complete summary of each finding and also a plan of how to fix it. also take into account the varaibles and functions names, and how module is structured. print the output to markdown file 

---

# File Manager Module — Code Review Report

> **Date:** 2026-04-16  
> **Scope:** `apps/server/src/modules/file-manager/`, `packages/contracts/src/file-manager/`, `apps/web/src/modules/file-manger/`, `apps/web/src/routes/_authenticated/file-manager/`

---

## Executive Summary

The file-manager module has **6 critical issues**, **11 high-severity issues**, **30+ medium issues**, and numerous low-severity findings. The most impactful problems are:

1. **The module is not registered in the app router** — all server endpoints are unreachable
2. **The frontend is entirely mock-driven** with zero API integration
3. **The frontend directory is misspelled** (`file-manger` instead of `file-manager`)
4. **The `buildMap` utility is completely broken** — silently discards all nested items
5. **The seed endpoint is publicly accessible** — no authentication required

---

## Critical Findings

### C1. Module Not Registered in App Router
- **File:** `apps/server/src/modules/file-manager/index.ts`, `apps/server/src/routers/common.ts`
- **Category:** Bug
- **Description:** The file-manager module exports `file`, `browse`, and `folder` routers from its `index.ts`, but these are never imported or registered in `common.ts`. The entire module is unreachable via the API.
- **Fix:** Add to `common.ts`:
  ```ts
  import { browse, file, folder } from "@/modules/file-manager";
  export const appRouter = {
    // ...existing routers
    file,
    folder,
    browse,
  };
  ```

### C2. Seed Endpoint Uses `publicProcedure` — No Auth Required
- **File:** `apps/server/src/modules/file-manager/browse.route.ts:10-23`
- **Category:** Security
- **Description:** The `seed` endpoint uses `publicProcedure`, allowing any unauthenticated user to insert dummy data into the database. It could also be used for DoS attacks.
- **Fix:** Change to `protectedProcedure` at minimum. Better yet, remove it from production routes or gate it behind an admin check.

### C3. Frontend Has Zero API Integration — Entirely Mock-Driven
- **File:** All files under `apps/web/src/modules/file-manger/`
- **Category:** Architecture
- **Description:** The entire frontend module runs on mock data. There are zero TanStack Query hooks, zero oRPC client calls, and zero references to `@workspace/contracts/file-manager`. All operations (rename, delete, create, copy/move) are no-ops that log to console and show toast messages.
- **Fix:** Replace mock API calls with TanStack Query mutations using the oRPC client. Load the file tree via `useQuery` from the server's browse endpoint. Use schemas from `@workspace/contracts/file-manager`.

### C4. Frontend Directory Misspelled: `file-manger` → `file-manager`
- **File:** `apps/web/src/modules/file-manger/` (entire directory)
- **Category:** Bug / Naming
- **Description:** Every import in the module references the misspelled path `file-manger` instead of `file-manager`. The route is `/file-manager/` but the module directory is misspelled, creating a permanent inconsistency.
- **Fix:** Rename the directory and update all imports.

### C5. `buildMap` Silently Discards All Nested Items
- **File:** `apps/server/src/modules/file-manager/utils.ts:13-21`
- **Category:** Bug
- **Description:** `buildMap` calls itself recursively on `item.children` but discards the returned `Map`. Only top-level items end up in the map. This makes the function completely non-functional for tree data.
  ```ts
  for (const item of items) {
    map.set(item.id, item);
    buildMap(item.children); // return value discarded!
  }
  ```
- **Fix:**
  ```ts
  for (const item of items) {
    map.set(item.id, item);
    for (const [k, v] of buildMap(item.children)) {
      map.set(k, v);
    }
  }
  ```

### C6. `selectedItems` State Defined in Two Different Slices
- **File:** `apps/web/src/modules/file-manger/store/slices/select-area-slice.ts:14`, `selection-slice.ts`
- **Category:** Bug
- **Description:** `selectedItems` is declared as a property in `SelectAreaSlice` but also written to by `SelectionSlice`. In Zustand, the last slice to spread wins, meaning the initial value could be overwritten unpredictably.
- **Fix:** `selectedItems` should be owned by exactly one slice. Other slices should only call `set()` to update it.

### C7. `entity.ts` Not Re-Exported from Contracts Barrel File
- **File:** `packages/contracts/src/file-manager/index.ts`
- **Category:** Bug / API Surface
- **Description:** The barrel file does not export from `./entity`. This means `FolderSchema`, `FolderTreeSchema`, and `FileSchema` are not available to consumers via `@workspace/contracts/file-manager`. External consumers can use the inferred types but not the schemas for standalone validation.
- **Fix:** Add `export * from "./entity";` to the barrel file.

---

## High-Severity Findings

### H1. SQL LIKE Wildcard Injection
- **File:** `file.route.ts:18`, `browse.route.ts:81,87`
- **Category:** Security
- **Description:** User-supplied `query` is interpolated directly into `ilike` patterns without escaping `%` and `_` wildcards. A user searching for `%` matches everything.
- **Fix:** Escape LIKE wildcards before interpolation:
  ```ts
  const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');
  ilike(files.name, `%${escaped}%`)
  ```

### H2. `list` Endpoint Missing `isDeleted` Filter
- **File:** `file.route.ts:14-26`
- **Category:** Bug
- **Description:** The file `list` handler does NOT filter out soft-deleted files (`isDeleted = true`). Users see deleted files in the regular listing, while `browse.route.ts` correctly filters them.
- **Fix:** Add `eq(files.isDeleted, false)` to the where conditions.

### H3. `bulkDelete` Has No Max Array Length
- **File:** `file.route.ts:149-160`, `contracts/file.ts:57`
- **Category:** Security / Performance
- **Description:** `ids: z.array(z.uuid()).min(1)` has no `.max()`. A client could send thousands of IDs causing a massive IN-query and potential DoS.
- **Fix:** Add `.max(100)` to the schema.

### H4. Folder Delete Hard-Deletes Files Inconsistently
- **File:** `folder.route.ts:122-125`
- **Category:** Bug / Data Integrity
- **Description:** Folder deletion hard-deletes all contained files via `tx.delete(files)`. But the file module uses soft-delete (`isDeleted = true`). This inconsistency means folder-deleted files can't be recovered.
- **Fix:** Soft-delete files (`isDeleted = true`) when deleting a folder, matching the file-level pattern.

### H5. `BAD_REQUEST_CHILD` Is Not a Standard Error Code
- **File:** `folder.route.ts:83`
- **Category:** Type-Safety
- **Description:** The error key `BAD_REQUEST_CHILD` is not a standard oRPC/HTTP error code and may not resolve to a proper status code.
- **Fix:** Use `CONFLICT` or `BAD_REQUEST` with a descriptive message:
  ```ts
  CONFLICT: { message: "You cannot move a folder under its own descendants" },
  ```

### H6. `folders.parentId` Missing Foreign Key Constraint
- **File:** `apps/server/src/modules/file-manager/schema.ts:15`
- **Category:** Data Integrity
- **Description:** `parentId: uuid()` has no `.references()` constraint. The database does not enforce referential integrity, allowing folders with non-existent parent IDs. Contrast with `files.folderId` which correctly has `.references(() => folders.id)`.
- **Fix:** `parentId: uuid().references(() => folders.id, { onDelete: "restrict" })`

### H7. `onDelete: "cascade"` Conflicts with Manual Cascade in Route Handler
- **File:** `schema.ts:49`
- **Category:** Bug / Data Integrity
- **Description:** The schema declares `onDelete: "cascade"` on `files.folderId`, but `folder.route.ts` also manually deletes files then folders in a transaction. This means both the application code and the database cascade will attempt deletion, causing redundancy and potential data loss.
- **Fix:** Remove `onDelete: "cascade"` from the schema and handle deletion in application code (or commit to cascade and remove the manual transaction), but don't do both.

### H8. `isDeleted` Column Is Nullable — SQL NULL Logic Bugs
- **File:** `schema.ts:53`
- **Category:** Bug
- **Description:** `isDeleted: boolean().default(false)` is missing `.notNull()`. The column allows `NULL`. Queries using `eq(files.isDeleted, false)` will exclude `NULL` rows, making files with `NULL isDeleted` invisible to both "active" and "trash" queries.
- **Fix:** `isDeleted: boolean().default(false).notNull()`, and update the contract to `isDeleted: z.boolean()`.

### H9. No Unique Constraints on `(name, parentId)` / `(name, folderId)`
- **File:** `schema.ts`
- **Category:** Bug / Data Integrity
- **Description:** No unique index exists on `(name, parentId)` for folders or `(name, folderId)` for files. Application-level uniqueness checks in `service.ts` are subject to TOCTOU race conditions — two concurrent requests can both pass the check and insert duplicates.
- **Fix:** Add unique indexes:
  ```ts
  uniqueIndex("folders_name_parent_idx").on(table.name, table.parentId),
  uniqueIndex("files_name_folder_idx").on(table.name, table.folderId),
  ```

### H10. No Database Indexes on Frequently Queried Columns
- **File:** `schema.ts`
- **Category:** Performance
- **Description:** `parentId`, `folderId`, `isDeleted`, `type`, and `createdAt` are all used in WHERE/ORDER BY clauses across routes but have no indexes. This will cause full table scans as data grows.
- **Fix:** Add indexes for these columns.

### H11. Tree Endpoint Fetches ALL Folders Into Memory
- **File:** `folder.route.ts:23-36`
- **Category:** Performance
- **Description:** The `tree` endpoint fetches ALL folders from the database regardless of `parentId`, builds a full tree in memory, then returns only the relevant subtree. For large datasets this is extremely wasteful.
- **Fix:** Use a recursive CTE to fetch only the relevant subtree, or cache the tree.

### H12. Duplicated Tree-Traversal Functions in `service.ts`
- **File:** `service.ts:38-94`
- **Category:** Code Quality
- **Description:** `collectFolderDescendants` and `getFolderDescendants` both load ALL folders from the DB and walk the tree. They should share the adjacency-building logic, or use a single function.
- **Fix:** Have `getFolderDescendants` call `collectFolderDescendants`:
  ```ts
  export async function getFolderDescendants(rootId: string): Promise<Set<string>> {
    const ids = await collectFolderDescendants(rootId);
    return new Set(ids);
  }
  ```

### H13. `create.request` Allows Client-Supplied `s3Key`
- **File:** `packages/contracts/src/file-manager/contracts/file.ts:30`
- **Category:** Security
- **Description:** The create request accepts `s3Key: z.string().optional()`. The server handler ignores it and generates its own key, but the contract still allows it through validation. A path traversal key like `../../other-user-file.jpg` could be passed.
- **Fix:** Remove `s3Key` from the create request schema entirely.

### H14. `FolderTree` Type Doesn't Match `FolderTreeSchema`
- **File:** `contracts/file.ts:121-122`
- **Category:** Bug / Type-Safety
- **Description:** `FolderTree` is defined as `z.infer<typeof FolderSchema> & { children: FolderTree[] }` instead of `z.infer<typeof FolderTreeSchema>`. If `FolderTreeSchema` adds or removes fields, `FolderTree` won't update automatically.
- **Fix:** `export type FolderTree = z.infer<typeof FolderTreeSchema>;`

### H15. No Soft-Delete for Folders
- **File:** `contracts/folder.ts`, `schema.ts`
- **Category:** Design / Data Safety
- **Description:** Files have soft-delete support (`delete` → `isDeleted: true`, `restore`, `permanentDelete`). Folders only have hard `delete`. Accidentally deleting a folder is irreversible. This is inconsistent with the file pattern.
- **Fix:** Add `isDeleted`/`deletedAt` to the folder schema and add `restore`/`permanentDelete` operations.

### H16. Frontend `isExpanded` Prop Bug in Tree Node
- **File:** `apps/web/src/modules/file-manger/components/tree/node.tsx:118`
- **Category:** Bug / UI
- **Description:** `isExpanded={isExpanded}` passes the **parent's** `isExpanded` to all children. This means ALL visible children in an expanded parent appear with the same expanded/collapsed state.
- **Fix:** `isExpanded={expandedFolders.has(child.id)}`

### H17. Frontend `aria-hidden="true"` on List Items
- **File:** `apps/web/src/modules/file-manger/components/item/list-item.tsx:28`
- **Category:** Accessibility
- **Description:** `aria-hidden="true"` makes list items completely invisible to screen readers — a severe accessibility bug for the list view.
- **Fix:** Remove `aria-hidden="true"` from the list item wrapper.

### H18. Frontend Debug Index Number Rendered in UI
- **File:** `apps/web/src/modules/file-manger/components/item/grid-item.tsx:72`
- **Category:** Bug / UI
- **Description:** `{index}. {item.name}` renders the array index number in the UI. Users see "0. resume_v3_final.pdf" instead of just "resume_v3_final.pdf".
- **Fix:** Remove the `{index}. ` prefix.

### H19. Frontend DnD Shallow Clone Mutates Original State
- **File:** `apps/web/src/modules/file-manger/store/slices/dnd-slice.ts:77-99`
- **Category:** Bug
- **Description:** `const newTree = { ...fileTree }` only clones the root object. `targetFolder.children` is then mutated in-place, violating Zustand's immutability contract and potentially causing stale UI.
- **Fix:** Deep-clone the tree before mutation, or use immutable update patterns.

### H20. Frontend Breadcrumb File Misspelled
- **File:** `apps/web/src/modules/file-manger/components/folder/breadcrub.tsx`
- **Category:** Naming
- **Description:** File is named `breadcrub.tsx` instead of `breadcrumb.tsx`. The import in `folder-content.tsx` references the misspelled filename.
- **Fix:** Rename to `breadcrumb.tsx` and update the import.

### H21. `metadataFactory` Returns `undefined` Instead of `null`
- **File:** `seed.ts:85`
- **Category:** Type-Safety / Bug
- **Description:** The `dataset` template's `metadataFactory` returns `undefined`, but the contracts schema defines `metadata` as `FileMetadataSchema.nullable()` which expects `null`. PostgreSQL JSONB serializes `undefined` differently from `null`.
- **Fix:** Return `null` instead of `undefined`.

### H22. No Validation Linking Between `mimeType`, `extension`, and `type`
- **File:** `contracts/enum.ts`
- **Category:** Validation / Type-Safety
- **Description:** There is no schema or utility validating the logical consistency between `mimeType`, `extension`, and `type` fields. A client could submit `{ type: "image", mimeType: "video/mp4", extension: "txt" }` and pass validation.
- **Fix:** Add `z.refine()` on the create request that validates the triple is consistent.

### H23. No Pagination on Any Browse/File Listing Endpoints
- **File:** `browse.route.ts`, `file.route.ts`
- **Category:** Performance
- **Description:** `all`, `list`, `search`, `trash`, and `recent` all return unbounded arrays. For large datasets these will cause memory and performance problems.
- **Fix:** Add pagination using `BasePaginationQuerySchema` from the contracts package.

### H24. No User Ownership / Multi-Tenancy
- **File:** All route files
- **Category:** Security
- **Description:** No queries filter by user ID. All authenticated users share the same file/folder namespace. `protectedProcedure` only verifies authentication, not ownership.
- **Fix:** Add `userId` columns to both tables and filter all queries by the authenticated user. (This may be intentional for a single-user app, but should be documented.)

---

## Medium-Severity Findings

### M1. Naming Convention: `fileRoute` Should Be `fileRouter`
- **File:** `file.route.ts:10`, `folder.route.ts`, `browse.route.ts`
- **Category:** Naming
- **Description:** AGENTS.md specifies router objects should use `Router` suffix (e.g., `linkRouter`). These use `Route` suffix instead.
- **Fix:** Rename to `fileRouter`, `folderRouter`, `browseRouter`.

### M2. Export Naming in `index.ts` Doesn't Match Conventions
- **File:** `apps/server/src/modules/file-manager/index.ts`
- **Category:** Naming
- **Description:** Exports use short names (`file`, `browse`, `folder`) while other modules use `Router` suffix.
- **Fix:** Export as `fileRouter`, `browseRouter`, `folderRouter`.

### M3. `create`/`rename`/`move` for Folders Return `z.void()`
- **File:** `contracts/folder.ts:17,25,33`
- **Category:** API Design / Consistency
- **Description:** Folder create/rename/move operations return `z.void()`, forcing clients to make an extra fetch. File operations return the full entity.
- **Fix:** Return `FolderSchema` for create/rename/move.

### M4. `download` and `preview` Return Identical Stubs
- **File:** `file.route.ts:252-282`
- **Category:** API Design
- **Description:** Both endpoints return `{ s3Key, downloadUrl: undefined }` with the same response shape. `preview` returns `downloadUrl` which is semantically wrong for a preview.
- **Fix:** Differentiate when S3 integration is added. For now, add a comment or extract a shared response schema.

### M5. Seed Returns Inconsistent Types
- **File:** `browse.route.ts:17-22`
- **Category:** Bug
- **Description:** Returns `false` (boolean) when data already exists, or `SeedFileManagerResult` (object) when seeding occurs. The contract has no output schema.
- **Fix:** Return a consistent type, e.g., `{ seeded: boolean, rootFolderId?: string }`.

### M6. Duplicate `FolderSchema` Fields in `FolderTreeSchema`
- **File:** `contracts/entity.ts:5-16`
- **Category:** DRY
- **Description:** `FolderTreeSchema` duplicates all fields from `FolderSchema` instead of extending it.
- **Fix:** `FolderSchema.extend({ children: z.lazy(() => z.array(FolderTreeSchema)) })`

### M7. Missing Metadata Schemas for `document`, `archive`, `text` Types
- **File:** `contracts/metadata.ts:37-42`
- **Category:** Validation
- **Description:** `FileTypeEnum` includes `"document"`, `"archive"`, and `"text"` types, but `FileMetadataSchema` only covers `"image"`, `"video"`, `"audio"`, and `"pdf"`. Files of those types can't have their metadata validated.
- **Fix:** Add `DocumentMetadataSchema`, `ArchiveMetadataSchema`, and `TextMetadataSchema`.

### M8. `OtherMetadataSchema` Commented Out
- **File:** `contracts/metadata.ts:32-35`
- **Category:** Validation
- **Description:** `FileTypeEnum` has `"other"` but the discriminated union has no variant for it.
- **Fix:** Uncomment and include `OtherMetadataSchema` in the union, or remove `"other"` from the enum.

### M9. Numeric Metadata Fields Have No `.positive()` Constraints
- **File:** `contracts/metadata.ts:5-7`
- **Category:** Validation
- **Description:** `width`, `height`, `duration`, `pages`, `bitrate` are bare `z.number()`. Negative values pass validation.
- **Fix:** Use `z.number().positive()` for dimensions, durations, and counts.

### M10. `isDeleted: z.boolean().nullable()` Mismatches DB Default
- **File:** `contracts/entity.ts:32`
- **Category:** Type-Safety
- **Description:** The contract says `isDeleted` is `z.boolean().nullable()` but the DB default is `false` (non-nullable). The contract type is wider than reality.
- **Fix:** Change to `isDeleted: z.boolean()`.

### M11. `s3Key` Has No Validation Pattern
- **File:** `contracts/entity.ts:29`
- **Category:** Security
- **Description:** `s3Key: z.string()` has no format validation. Could allow path-traversal-like strings.
- **Fix:** Add regex: `z.string().regex(/^[a-zA-Z0-9!_.*'()-]+(\/[a-zA-Z0-9!_.*'()-]+)*$/).max(1024)`

### M12. `name` Fields Have No `.max()` Constraints
- **File:** `contracts/file.ts:23,38`, `contracts/folder.ts:14,23`
- **Category:** Validation
- **Description:** File/folder names have `.min(1)` but no `.max()`. Filesystems typically limit names to 255 characters.
- **Fix:** Add `.max(255)` to name fields.

### M13. `downloadUrl` Should Use `z.url()` Not `z.string()`
- **File:** `contracts/file.ts:105,113`
- **Category:** Validation
- **Description:** `downloadUrl: z.string().optional()` should validate as a URL.
- **Fix:** `downloadUrl: z.url().optional()`

### M14. Missing `updatedAt` on Both Entities
- **File:** `schema.ts`, `contracts/entity.ts`
- **Category:** Consistency
- **Description:** Neither `files` nor `folders` have an `updatedAt` column. The project's `AuditedEntityModel` pattern includes `updatedAt: timestamp().$onUpdate(() => new Date())`.
- **Fix:** Add `updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date())`.

### M15. `timestamp()` Missing `withTimezone: true`
- **File:** `schema.ts:17,55`
- **Category:** Consistency
- **Description:** Uses `timestamp()` without timezone, while other modules use `timestamp({ withTimezone: true })`.
- **Fix:** Add `{ withTimezone: true }` to match project convention.

### M16. `uuid().defaultRandom()` Instead of `$defaultFn(() => uuidV7())`
- **File:** `schema.ts:11,35`
- **Category:** Performance
- **Description:** Uses UUIDv4 (random, index-unfriendly) instead of UUIDv7 (time-sortable, better for B-tree performance) used by other modules via `IdentifiedEntityModel`.
- **Fix:** Use `uuid().primaryKey().$defaultFn(() => uuidV7())`.

### M17. Folder `delete` Deletes ALL Files Then ALL Folders Unscoped
- **File:** `seed.ts:127-130`
- **Category:** Data Integrity
- **Description:** When `resetExisting` is true, `tx.delete(files)` and `tx.delete(folders)` delete ALL rows, not just seeded data. This is destructive beyond the intended scope.
- **Fix:** Scope the delete to seed-created data using a naming pattern like `seed-%`.

### M18. Seed Not Idempotent — Creates Duplicate Root Folders
- **File:** `seed.ts:132-144`
- **Category:** Data Integrity
- **Description:** If called multiple times without `resetExisting`, a new root folder is created each time.
- **Fix:** Check for existing seed root folder by name before inserting.

### M19. Seed Defaults to Logging (`options.log ?? true`)
- **File:** `seed.ts:209`
- **Category:** Security / Operations
- **Description:** Seed data details (folder count, file count, root ID) are logged by default in production.
- **Fix:** Default to `false` or tie to environment.

### M20. `findNode` Has No Cycle Protection
- **File:** `utils.ts:2-11`
- **Category:** Bug / Robustness
- **Description:** If the tree contains a circular reference, `findNode` will stack-overflow.
- **Fix:** Add a `visited` set parameter to detect cycles.

### M21. `folderRowsToNodes` Orphans Become Root Nodes Silently
- **File:** `utils.ts:31-36`
- **Category:** Data Integrity
- **Description:** Folders with a `parentId` pointing to a non-existent parent silently become root nodes instead of being flagged.
- **Fix:** Separate the `null parentId` case from the dangling reference case.

### M22. Frontend Type System Disconnected from Contracts
- **File:** `apps/web/src/modules/file-manger/types/index.ts`
- **Category:** Type-Safety
- **Description:** Frontend defines its own `FileItem` type with completely different fields than the contracts package. `type: "file" | "folder"` vs contracts' `FileType` enum. Missing fields: `mimeType`, `extension`, `s3Key`, `isDeleted`, `metadata`.
- **Fix:** Derive frontend types from `@workspace/contracts/file-manager` schemas using `z.infer`.

### M23. Frontend Global Keyboard Listener Conflicts with Inputs
- **File:** `apps/web/src/modules/file-manger/components/folder/folder-content.tsx:28-37`
- **Category:** Bug / Accessibility
- **Description:** `document.addEventListener("keydown", handleKeyNavigation)` is global and captures arrow keys, Ctrl+A, Escape everywhere on the page, conflicting with search inputs and text fields.
- **Fix:** Scope the listener to the file manager container element.

### M24. Frontend Recursive O(n) Lookups on Every Keypress
- **File:** `apps/web/src/modules/file-manger/store/slices/navigation-slice.ts:70-71`, `utils/file-utils.ts:3-14`
- **Category:** Performance
- **Description:** `findItemById` is called on every keypress for navigation. With 170+ items, this is an O(n) recursive traversal every time.
- **Fix:** Build a flat index `Map<string, FileItem>` for O(1) lookups.

### M25. Frontend Layout Thrashing in Drag-Select
- **File:** `apps/web/src/modules/file-manger/store/slices/select-area-slice.ts:122-175`
- **Category:** Performance
- **Description:** `updateSelectedItems` calls `getBoundingClientRect()` on every item during every pointer move event, causing layout thrashing.
- **Fix:** Use `IntersectionObserver` or throttle bounding rect reads.

### M26. `FolderTreeSchema` Uses Getter for Recursion
- **File:** `contracts/entity.ts:12-20`
- **Category:** Type-Safety
- **Description:** Uses `get children()` for lazy evaluation. This is non-standard for Zod and may break with `.parse()` or type inference. Use `z.lazy()` instead.
- **Fix:** Use `z.lazy(() => z.array(FolderTreeSchema))`.

### M27. Enum Naming Uses `Enum` Suffix Instead of `Schema`
- **File:** `contracts/enum.ts`
- **Category:** Naming
- **Description:** `FileTypeEnum`, `MimeTypeEnum`, `FileExtensionEnum` use `Enum` suffix. AGENTS.md specifies `Schema` suffix for Zod schemas.
- **Fix:** Rename to `FileTypeSchema`, `MimeTypeSchema`, `FileExtensionSchema`, or document an exception for enums.

### M28. Frontend `getAllInceptors` Naming
- **File:** `apps/web/src/modules/file-manger/utils/file-utils.ts:48`
- **Category:** Naming
- **Description:** "Inceptor" means "beginner/student", not "ancestor path items". Should be `getAncestors` or `getPathItems`.
- **Fix:** Rename to `getAncestors`.

### M29. Unused `buildMap` Function
- **File:** `utils.ts:13-21`
- **Category:** Dead Code
- **Description:** `buildMap` is not imported anywhere in the codebase, and it's also broken (see C5).
- **Fix:** Fix and use it, or remove it.

### M30. `seed` Endpoint Has No Output Schema
- **File:** `browse.route.ts:10`
- **Category:** Type-Safety
- **Description:** No `.output()` defined, meaning the response shape is unvalidated.
- **Fix:** Add an output schema to the seed handler.

---

## Low-Severity Findings

### L1. Redundant `existsById` Then Re-Query Pattern
- **File:** `file.route.ts:136-147,166-177,183-192`
- **Category:** Performance
- **Description:** `delete`/`restore`/`permanentDelete` first call `existsById` (one query) then perform `update`/`delete` with `.returning()`. Since `.returning()` returns the affected row(s), the existence check is redundant.
- **Fix:** Use `.returning()` result to check existence, saving a DB round-trip.

### L2. Two UUIDs Generated for S3 Key
- **File:** `file.route.ts:56,72`
- **Category:** Clarity
- **Description:** `uuidV7()` is called for `fileId` but the S3 key generates a different `uuidV7()`. The `fileId` should be used in the S3 key for traceability.
- **Fix:** Use `fileId` in the S3 key: `files/${fileId}-${input.name}`.

### L3. Comments Violate AGENTS.md "No Comments" Rule
- **File:** Multiple files
- **Category:** Style
- **Description:** Several TODO comments and inline comments exist. AGENTS.md says "DO NOT ADD ANY COMMENTS unless asked."
- **Fix:** Remove or resolve TODO comments.

### L4. Inconsistent Zod Import Style
- **File:** `contracts/metadata.ts:1` uses `import { z } from "zod"` while all other files use `import z from "zod"`.
- **Fix:** Standardize to `import z from "zod"`.

### L5. `restore` Doesn't Verify File Is Actually Soft-Deleted
- **File:** `file.route.ts:166-177`
- **Category:** Bug
- **Description:** `existsById` matches any row regardless of `isDeleted` status. Restoring a file that isn't deleted silently succeeds.
- **Fix:** Check `isDeleted === true` before allowing restore.

### L6. Missing Common MIME Types
- **File:** `contracts/enum.ts:16-53`
- **Category:** Validation
- **Description:** `MimeTypeEnum` is missing common types: `image/avif`, `image/bmp`, `text/html`, `text/markdown`, `application/rtf`, etc.
- **Fix:** Add commonly expected MIME types or add an escape-hatch schema.

### L7. Missing `z.min()` on Numeric Metadata Fields
- **File:** `contracts/metadata.ts`
- **Category:** Validation
- **Description:** No `.positive()` or `.min()` on `width`, `height`, `duration`, `pages`, `bitrate`.
- **Fix:** Add `.positive()` constraints.

### L8. `seed` Not Defined in `BrowseSchemas`
- **File:** `contracts/browse.ts`
- **Category:** Completeness
- **Description:** The server has a `browse.seed` endpoint but no corresponding schema in `BrowseSchemas`.
- **Fix:** Add a schema or document the endpoint separately.

### L9. Frontend `localStorage.getItem` at Module Level (SSR-Unsafe)
- **File:** `apps/web/src/modules/file-manger/store/slices/ui-slice.ts:21`
- **Category:** Bug
- **Description:** `localStorage.getItem("treeWidth")` is called at module initialization, which will throw in SSR environments.
- **Fix:** Lazy-initialize or guard with `typeof window !== "undefined"`.

### L10. Frontend `use-mobile` Hook May Be Duplicated
- **File:** `apps/web/src/modules/file-manger/hooks/use-mobile.ts`
- **Category:** Code Quality
- **Description:** This is a standard shadcn/ui hook that likely already exists in `@/hooks/`.
- **Fix:** Check for existing `use-mobile` hook and use it instead.

### L11. Frontend Empty `index.tsx` Barrel File
- **File:** `apps/web/src/modules/file-manger/index.tsx`
- **Category:** Dead Code
- **Description:** The barrel file is completely empty.
- **Fix:** Export the public API or remove the empty file.

### L12. Frontend Toast for Unimplemented Feature
- **File:** `context-slice.ts:79`
- **Category:** UX
- **Description:** `toast.success("Upload functionality would be implemented here")` — showing a success toast for an unimplemented feature is misleading.
- **Fix:** Show "Coming soon" or disable the button.

### L13. Emoji in Code Comments
- **File:** `schema.ts:21,27,30`
- **Category:** Style
- **Description:** Comments use emojis (🔼, 🔽, 📄). Per AGENTS.md, emojis should only be used if explicitly requested.
- **Fix:** Remove emojis from comments.

### L14. Frontend Commented-Out Code Throughout
- **File:** Multiple files (`grid-item.tsx:45`, `new-folder.tsx:20-21`, `rename.tsx:72`, `select-area-slice.ts:42,273`)
- **Category:** Style
- **Description:** Numerous commented-out code blocks and TODOs.
- **Fix:** Remove or track as issues.

### L15. `toChunks` Doesn't Validate `size` Parameter
- **File:** `seed.ts:108-116`
- **Category:** Robustness
- **Description:** If `size` is 0 or negative, `toChunks` would create an infinite loop.
- **Fix:** Add guard: `if (size < 1) throw new Error("Chunk size must be at least 1");`

### L16. Seed Has No Upper Bound on `totalItems`
- **File:** `seed.ts:121`
- **Category:** Performance
- **Description:** `Math.max(20, options.totalItems ?? 200)` has no upper limit. Calling with `totalItems: 1000000` could consume significant memory.
- **Fix:** Add `Math.min(10000, ...)` or a configurable max.

---

## Remediation Plan

### Phase 1: Critical Fixes (Immediate)

| # | Issue | Action |
|---|-------|--------|
| C1 | Module not in router | Register file-manager routers in `common.ts` |
| C2 | Public seed endpoint | Change to `protectedProcedure`, add admin check |
| C5 | Broken `buildMap` | Fix recursive result collection or remove dead code |
| C7 | Missing entity re-export | Add `export * from "./entity"` to barrel file |
| C4 | Misspelled directory | Rename `file-manger` → `file-manager`, update imports |

### Phase 2: Security & Data Integrity (1-2 days)

| # | Issue | Action |
|---|-------|--------|
| H1 | SQL LIKE injection | Escape wildcards in search queries |
| H2 | Missing `isDeleted` filter | Add filter to file `list` endpoint |
| H4 | Hard-delete inconsistency | Soft-delete files when deleting folders |
| H6 | Missing FK on `parentId` | Add `.references(() => folders.id)` |
| H7 | Cascade conflict | Remove `onDelete: "cascade"` from schema |
| H8 | Nullable `isDeleted` | Add `.notNull()` to column and contract |
| H9 | No unique constraints | Add composite unique indexes |
| H13 | Client `s3Key` accepted | Remove from create request schema |

### Phase 3: Type Safety & Contracts (2-3 days)

| # | Issue | Action |
|---|-------|--------|
| H14 | Mismatched `FolderTree` type | Use `z.infer<typeof FolderTreeSchema>` |
| H22 | No mimeType/extension validation | Add `z.refine()` on create request |
| M6 | Duplicated schema fields | Use `FolderSchema.extend(...)` |
| M7-M9 | Missing metadata schemas | Add document/archive/text metadata |
| M10 | Nullable `isDeleted` mismatch | Align contract with DB |
| M14-M16 | Missing `updatedAt`, timezone, UUIDv7 | Align with project patterns |

### Phase 4: Frontend Integration (3-5 days)

| # | Issue | Action |
|---|-------|--------|
| C3 | No API integration | Replace mock API with TanStack Query + oRPC |
| C6 | Dual `selectedItems` ownership | Consolidate into one slice |
| H16 | `isExpanded` prop bug | Pass each child's expanded state |
| H17 | `aria-hidden` on list items | Remove the attribute |
| H18 | Debug index in UI | Remove `{index}. ` |
| H19 | Shallow clone in DnD | Deep-clone tree before mutation |
| H20 | Misspelled breadcrumb file | Rename `breadcrub.tsx` → `breadcrumb.tsx` |
| M22 | Disconnected types | Derive from contracts package |
| M23 | Global keyboard listener | Scope to container element |

### Phase 5: Performance & Polish (2-3 days)

| # | Issue | Action |
|---|-------|--------|
| H10 | Missing DB indexes | Add indexes on `parentId`, `folderId`, `isDeleted`, `type`, `createdAt` |
| H11-H12 | Full-table scans | Use recursive CTE or add caching |
| H23 | No pagination | Add `BasePaginationQuerySchema` to all listing endpoints |
| M24 | Recursive O(n) lookups | Build flat index Map |
| M25 | Layout thrashing in drag-select | Use IntersectionObserver or throttle |

---

**Total Findings:** 6 Critical + 24 High + 30 Medium + 16 Low = **76 findings**