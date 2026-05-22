# AGENTS.md

Coding agent guidelines for this repository.


## 🧠 Core Idea

Core Idea: Personal Knowledge Graph
This project is a personal knowledge graph — not just a bookmark manager. The central concept is:
1. Everything is an Item — a polymorphic entity that can be a social media post or a creator profile, sourced from Instagram, TikTok, or Twitter. Each item carries platform-specific metadata via a discriminated union schema.
2. Items are connected via Relations — typed directed edges (created_by, tagged, mentions, quoted, related) that form a graph. For example, a post item is linked to its creator profile via created_by, and tagged profiles carry x/y coordinates for positioning within photos.
3. Organization through Collections & Tags — Collections form hierarchical trees (PostgreSQL ltree), while Tags provide flat cross-cutting labels. Both attach to Items.
4. A "Post" is an assembled view — when you query a post, it resolves the item + its creator (via created_by relation) + tagged profiles (via tagged relation) + media attachments + collection memberships into a single rich object.
5. Data flows in via imports — raw platform exports are parsed, normalized into items+relations+media, and processed through async download tasks that fetch media to S3.
Additionally there's a separate Link system for traditional URL bookmarks with OpenGraph previews, and a File Manager for general-purpose file storage — but the knowledge graph (Items + Relations) is the architectural heart of the project.

## Project Overview

> This project will be used by one person. its for personal use

Monorepo using pnpm workspaces + Turborepo. Contains a bookmark manager application with:
- **apps/web** - React frontend (TanStack Router, Vite, shadcn/ui, TailwindCSS v4)
- **apps/server** - Backend API (Hono, oRPC, Bun, Drizzle ORM, PostgreSQL)
- **apps/extension** - Browser extension (Chrome/Firefox)
- **apps/parser** - Parser utility scripts
- **packages/contracts** - Shared Zod schemas and TypeScript types
- **packages/core** - Shared utilities

## A small glossary

Graph core
- **Item**: polymorphic node. `externalId + platform + kind + metadata`. Persisted form adds `tagIds`, `collectionIds`, `favorite`, `rate`, `note`.
- **Platform** / **Kind**: platforms `instagram, tiktok, twitter, chrome, imdb, mal, youtube`; kinds `post, profile, link, movie, tv, anime, video`.
- **ItemMetadata**: discriminated union on `platform`, then `kind`. Platform-specific fields live here, never on Item root.
- **Relation**: typed directed edge `fromItemId -> toItemId`. Types: `created_by, tagged, mentions, quoted, related`. `tagged` carries `x/y` photo coordinates.
- **Media**: file attached to an `itemId` via S3 `key`. Raw `type: image|video|gif`; assembled view uses `NormalizedMedia` (image/video + dimensions, video adds `thumbnail/duration`).

Organization
- **Collection**: hierarchical tree (`parentId, path, level`), attached to Items by id.
- **Tag**: flat label, name normalized to lowercase-dashed, attached to Items by id.

Assembled views
- **Post**: read-model joining item + `creator` (Profile) + `media[]` + `collections` + `tags` + `taggedItems` (with `x/y`) + optional `quoteItem`.
- **Profile**: `kind: profile` with `username, name, avatar, verified, postCount/tagCount`.
- **Link**: `chrome` bookmark (OpenGraph preview) plus `FolderTree`.

Ingest pipeline
- **Raw**: unmodified platform export types (`instagram.ts, tiktok.ts, twitter.ts`).
- **PlatformHandler**: per-platform `validate(data)` (valid/invalid counts) + `parse(data)` (raw -> ImportPayload).
- **Import / ImportPayload**: Import is the upload record (`filename, platform, validPost/invalidPost`). Payload is the normalized batch: `items + relations + downloadTasks + invalidItems`.

Background jobs
- **Job**: async work unit. Types: `import_upload, import_process, download_media, *_discover, *_fetch, youtube_download`. Status: `pending, processing, retrying, completed, failed, cancelled`.
- **JobGroup**: named batch (e.g. discover spawns one fetch job per id; post-process spawns one `download_media` per attachment).
- **JobLog**: `debug|info|warn|error` line scoped to a `jobId`.

Storage
- **File Manager**: generic S3 storage outside the graph. `Folder/FolderTree` + `File` (`s3Key, folderId, mimeType`); `BrowseItem` is either.
