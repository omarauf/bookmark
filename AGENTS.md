# AGENTS.md

Coding agent guidelines for this repository.

## Project Overview

Monorepo using pnpm workspaces + Turborepo. Contains a bookmark manager application with:
- **apps/web** - React frontend (TanStack Router, Vite, shadcn/ui, TailwindCSS v4)
- **apps/server** - Backend API (Hono, oRPC, Bun, Drizzle ORM, PostgreSQL)
- **apps/extension** - Browser extension (Chrome/Firefox)
- **apps/parser** - Parser utility scripts
- **packages/contracts** - Shared Zod schemas and TypeScript types
- **packages/core** - Shared utilities

## Build/Lint/Test Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Start all apps
pnpm dev:web                # Start web app only (port 3001)
pnpm dev:server             # Start server only (port 3000)

# Build
pnpm build                  # Build all apps

# Linting & Formatting (Biome)
pnpm check                  # Format + lint with auto-fix (recommended)
pnpm lint                   # Lint only with auto-fix
pnpm format                 # Format only with auto-fix

# Type Checking
pnpm check-types            # TypeScript type check across all apps

# Testing
pnpm --filter web test      # Run all tests in web app
pnpm --filter web vitest run                    # Run all tests
pnpm --filter web vitest run src/foo.test.ts   # Run single test file
pnpm --filter web vitest run -t "test name"    # Run tests matching pattern

# Database (Drizzle)
pnpm db:push                # Push schema changes to database
pnpm db:generate            # Generate migrations
pnpm db:migrate             # Run migrations
pnpm db:studio              # Open Drizzle Studio
pnpm db:seed                # Seed database

# Docker
pnpm docker:up              # Start Docker services
pnpm docker:down            # Stop Docker services
```

## Code Style

### Biome Configuration

- **Formatter**: 2-space indentation, 100 char line width, double quotes
- **Imports**: Auto-organized on format
- **Linting**: Recommended rules enabled

Run `pnpm check` before committing to auto-fix issues.

### TypeScript

- Strict mode enabled
- `noUnusedLocals`, `noUnusedParameters` enabled
- `verbatimModuleSyntax` enabled - use explicit type imports:
  ```typescript
  import type { Foo } from "bar";
  ```

### Path Aliases

- `@/*` maps to `./src/*` in all apps
- Workspace packages: `@workspace/contracts`, `@workspace/core`
- Server exports: `server/route`, `server/auth`

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Components | CamelCase | `button.tsx`, `creator-profile.tsx` |
| Routes | kebab-case or route format | `__root.tsx`, `_authenticated/users/index.tsx` |
| Schemas | `.schema.ts` suffix | `link.schema.ts` |
| Routes (server) | `.route.ts` suffix | `link.route.ts` |
| Utilities | camelCase | `utils.ts`, `format.ts` |
| Hooks | `use-` prefix | `use-dialog-state.tsx` |

### Code

- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: camelCase (or SCREAMING_SNAKE_CASE for true constants)
- **React Components**: PascalCase, named export
- **Zod Schemas**: PascalCase with `Schema` suffix (e.g., `LinkSchema`)
- **Router objects**: camelCase with `Router` suffix (e.g., `linkRouter`)
- **Database tables**: camelCase plural (e.g., `links`)

## Import Organization

Imports are auto-organized by Biome. Typical order:

```typescript
// 1. External packages
import { Hono } from "hono";
import { z } from "zod";

// 2. Workspace packages
import { LinkSchema } from "@workspace/contracts/link";

// 3. Internal imports (path aliases)
import { db } from "@/core/db";
import { publicProcedure } from "@/lib/orpc";

// 4. Relative imports
import { links } from "./schema";
```

## Error Handling

### oRPC Errors

```typescript
publicProcedure
  .input(schema)
  .errors({
    BAD_REQUEST: { message: "Description of error" },
    NOT_FOUND: { message: "Resource not found" },
  })
  .handler(async ({ input, errors }) => {
    if (!resource) throw errors.NOT_FOUND();
    if (invalid) throw errors.BAD_REQUEST();
  });
```

### Try-Catch

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch {
  throw errors.BAD_REQUEST();
}
```

### Validation

Use Zod schemas from `@workspace/contracts` for request/response validation:

```typescript
.input(LinkSchemas.create.request)
.output(LinkSchemas.create.response)
```

## React Components

### Component Pattern

```typescript
import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  variant?: "default" | "outline";
}

export function Button({ className, variant = "default" }: ButtonProps) {
  return (
    <button className={cn("base-classes", className)}>
      {/* content */}
    </button>
  );
}
```

### Styling

- Use TailwindCSS utility classes
- Use `cn()` utility for conditional class merging
- shadcn/ui components in `src/components/ui/`
- Custom components in `src/components/`

## API Routes (oRPC)

### Router Structure

```typescript
// apps/server/src/modules/link/route.ts
import { LinkSchemas } from "@workspace/contracts/link";
import { publicProcedure } from "@/lib/orpc";

export const linkRouter = {
  list: publicProcedure
    .input(LinkSchemas.list.request)
    .output(LinkSchemas.list.response)
    .handler(async ({ input }) => {
      // implementation
    }),

  create: publicProcedure
    .input(LinkSchemas.create.request)
    .handler(async ({ input }) => {
      // implementation
    }),
};
```

### Register Router

Add to `apps/server/src/routers/common.ts`:

```typescript
import { linkRouter } from "@/modules/link/route";

export const appRouter = {
  link: linkRouter,
  // other routers
};
```

## Database (Drizzle ORM)

### Schema Definition

```typescript
// apps/server/src/modules/link/schema.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
```

### Query Pattern

```typescript
import { db } from "@/core/db";
import { eq, and, isNull } from "drizzle-orm";
import { links } from "./schema";

const result = await db.query.links.findMany({
  where: and(isNull(links.deletedAt), eq(links.id, id)),
});
```

## Commit Messages

Must start with one of these prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `cleaner:` - Code cleanup

Example: `feat: add link preview fetching`

## Environment Variables

- Server: `apps/server/.env` (validated by Zod in `src/config/env.ts`)
- Web: `apps/web/.env` (VITE_ prefix for client-side)

Required server env vars:
- `DATABASE_URL`, `CORS_ORIGIN`, `DOMAIN`
- `S3_*` variables for file storage
- `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`
