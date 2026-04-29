# Contracts Package Architecture

> Shared Zod schemas and TypeScript types for the entire monorepo.

This package is organized into **strict dependency layers**. A module may only import from its own layer or from layers *below* it. This prevents circular dependencies and makes the architecture explicit.

---

## Dependency Layers

```
Layer 3: views/           (assembled read-models)
     ↑
Layer 2: core/            (knowledge graph primitives)
     ↑
Layer 1: platforms/       (platform-specific metadata + raw JSON)
     ↑
Layer 0: foundation/      (primitives with no domain knowledge)

Layer 4: operations/      (side-systems — imports from all layers above)
```

---

## Layer Reference

### `foundation/` — Layer 0

Primitives used by every other layer. **Must not** import from any other layer.

| File | Exports | Description |
|------|---------|-------------|
| `platform.ts` | `PlatformEnum`, `KindEnum` | Discriminant values for items |
| `color.ts` | `ColorSchema` | Hex color validation |
| `date.ts` | `dateOnly()` | `YYYY-MM-DD` string validator |
| `pagination-query.ts` | `BasePaginationQuerySchema`, `PaginationResultSchema` | Pagination helpers |

---

### `platforms/` — Layer 1

Platform-specific metadata schemas consumed by `ItemMetadataSchema`, plus raw JSON interfaces for third-party payloads.

#### Zod metadata modules

| Module | Exports | Description |
|--------|---------|-------------|
| `instagram/` | `InstagramMetadataPostSchema`, `InstagramMetadataCreatorSchema` | Instagram posts & creators |
| `tiktok/` | `TiktokMetadataPostSchema`, `TiktokMetadataCreatorSchema` | TikTok posts & creators |
| `twitter/` | `TwitterMetadataPostSchema`, `TwitterMetadataCreatorSchema` | Twitter posts & creators |
| `chrome/` | `ChromeLinkMetadataSchema`, `PreviewSchema` | Bookmark link metadata |
| `imdb/` | `MovieMetadataSchema`, `TvMetadataSchema` | Movie & TV metadata |

Each platform schema **must** include `platform` and `kind` literal fields so they compose into the discriminated union in `core/item/metadata.ts`.

#### Raw JSON interfaces (`platforms/raw/`)

TypeScript interfaces for raw third-party API responses. These are **not Zod schemas** — they are `interface` declarations generated from actual payloads.

| File | Description |
|------|-------------|
| `instagram.ts` | Raw Instagram media JSON (~1000 lines) |
| `tiktok.ts` | Raw TikTok API response |
| `twitter.ts` | Raw Twitter bookmark timeline JSON |

These have no imports and are used only by platform parsers in `apps/server`.

---

## Import Rules

```
foundation   ←  platforms, core, views, operations
platforms    ←  core, views, operations
core         ←  views, operations
views        ←  operations
operations   ←  (may import from any layer)
```

**Never:**
- Import `views` into `core`
- Import `operations` into `core`
- Import `core` into `foundation`

---

## Export Map

Consumers import via subpaths. The `package.json` exports are pinned to the layer structure:

| Consumer import | Maps to |
|-----------------|---------|
| `@workspace/contracts/item` | `src/core/item/index.ts` |
| `@workspace/contracts/post` | `src/views/post/index.ts` |
| `@workspace/contracts/link` | `src/views/link/index.ts` |
| `@workspace/contracts/relation` | `src/core/relation/index.ts` |
| `@workspace/contracts/media` | `src/core/media/index.ts` |
| `@workspace/contracts/collection` | `src/core/collection/index.ts` |
| `@workspace/contracts/tag` | `src/core/tag/index.ts` |
| `@workspace/contracts/profile` | `src/views/profile/index.ts` |
| `@workspace/contracts/import` | `src/operations/import/index.ts` |
| `@workspace/contracts/download-task` | `src/operations/download-task/index.ts` |
| `@workspace/contracts/file-manager` | `src/operations/file-manager/index.ts` |
| `@workspace/contracts/platform` | `src/foundation/platform.ts` |
| `@workspace/contracts/common/*` | `src/foundation/*.ts` |
| `@workspace/contracts/instagram` | `src/platforms/instagram/index.ts` |
| `@workspace/contracts/tiktok` | `src/platforms/tiktok/index.ts` |
| `@workspace/contracts/twitter` | `src/platforms/twitter/index.ts` |
| `@workspace/contracts/imdb` | `src/platforms/imdb/index.ts` |
| `@workspace/contracts/raw/*` | `src/platforms/raw/*.ts` |

---

## Adding a New Platform

1. Add literals to `foundation/platform.ts`:
   ```ts
   export const PlatformEnum = z.enum(["instagram", "tiktok", "twitter", "chrome", "imdb", "youtube"]);
   export const KindEnum = z.enum(["post", "profile", "link", "movie", "tv", "short"]);
   ```

2. Create `src/platforms/youtube/post.ts`:
   ```ts
   export const YoutubeMetadataPostSchema = z.object({
     platform: z.literal("youtube"),
     kind: z.literal("short"),
     duration: z.number(),
   });
   ```

3. Register in `core/item/metadata.ts`:
   ```ts
   z.discriminatedUnion("kind", [YoutubeMetadataPostSchema]),
   ```

4. Add to `package.json` exports if consumers need direct access:
   ```json
   "./youtube": "./src/platforms/youtube/index.ts"
   ```

---

## Adding a New View

1. Create `src/views/feed/entity.ts`:
   ```ts
   export const FeedSchema = ItemSchema.extend({
     media: NormalizedMediaSchema.array(),
     creator: ProfileSchema,
   });
   ```

2. Create `src/views/feed/contract.ts` with `FeedSchemas` (list, get, etc.).

3. Export from `src/views/feed/index.ts`.

4. Add to `package.json` exports.

---

## Schema Naming Convention

| Pattern | Example |
|---------|---------|
| Zod schema | `ItemSchema`, `ColorSchema` |
| API contract group | `ItemSchemas`, `PostSchemas` |
| Creation input | `CreateItemSchema`, `CreateRelationSchema` |
| Enum | `PlatformEnum`, `RelationEnum` |
| Values array | `PlatformValues`, `RelationValues` |
| Inferred type | `type Item = z.infer<typeof ItemSchema>` |

---

## Zod Style

- Always use `import { z } from "zod"` (explicit form, Zod v4).
- Use `.optional().catch(undefined)` for optional query params.
- Discriminated unions for polymorphism (`platform` → `kind`).
- `CreateXxxSchema` vs `XxxSchema` pattern for input vs full entity.
