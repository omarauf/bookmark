# Bookmark Manager

A modern bookmark manager application for organizing and managing bookmarks across platforms.

## What is this project?

Bookmark Manager is a full-stack application designed to help users organize, manage, and access their bookmarks efficiently. It provides a web interface for managing bookmarks, a browser extension for quick bookmarking, and a backend API for data persistence and processing.

The application supports importing bookmarks from various platforms (Twitter, Instagram, TikTok), automatically fetching link previews, organizing bookmarks with folders and tags, and provides a clean, modern user interface built with React and shadcn/ui components.

## Tech Stack

- **Frontend**: React, TanStack Router, Vite, shadcn/ui, TailwindCSS v4
- **Backend**: Hono, oRPC, Bun, Drizzle ORM, PostgreSQL
- **Extension**: Browser extension (Chrome/Firefox)
- **Monorepo**: pnpm workspaces + Turborepo

## Project Structure

```
manager/
├── apps/
│   ├── web/         # Frontend (port 3001)
│   ├── server/      # Backend API (port 3000)
│   ├── extension/   # Browser extension
│   └── parser/      # Parser utility
├── packages/
│   ├── contracts/   # Shared Zod schemas
│   └── core/        # Shared utilities
└── infrastructure/  # Docker compose
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Docker

### Installation

```bash
pnpm install
```

### Environment Setup

**apps/server/.env**:
```
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3001
REDIS_HOST=localhost
REDIS_PORT=6379
S3_REGION=...
S3_ENDPOINT=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET_NAME=...
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=...
```

**apps/web/.env**:
```
VITE_API_URL=http://localhost:3000
VITE_S3_URL=...
```

### Database Setup

```bash
pnpm docker:up      # Start PostgreSQL & Redis
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed initial data
```

### Development

```bash
pnpm dev            # Start all apps
```

- Web: http://localhost:3001
- API: http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps |
| `pnpm build` | Build all apps |
| `pnpm check` | Format + lint |
| `pnpm check-types` | Type check |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm docker:up` | Start services |
| `pnpm docker:down` | Stop services |

## Features

- Bookmark organization with folders and tags
- Link preview fetching
- Browser extension for quick bookmarking
- Import/export bookmarks
- Multi-platform support (Twitter, Instagram, TikTok)
