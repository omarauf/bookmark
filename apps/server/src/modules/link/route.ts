import { LinkSchemas, type PathNode } from "@workspace/contracts/link";
import axios from "axios";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { getPreviewFromContent } from "link-preview-js";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "../item/schema";
import { mapItemToLink } from "./mapper";

export const linkRouter = {
  tree: protectedProcedure
    .input(LinkSchemas.tree.request)
    .output(LinkSchemas.tree.response)
    .handler(async ({ input }) => {
      const basePath = input.path?.replace(/\/+$/, "") ?? "";

      const selectedLinks = await db.query.items.findMany({
        where: and(
          like(sql`(${items.metadata} ->> 'path')`, `${basePath}%`),
          isNull(items.deletedAt),
          eq(items.platform, "chrome"),
          // sql`${items.metadata} ->> 'kind' = 'link'`,
        ),
        orderBy: [desc(items.createdAt), desc(items.id)],
      });

      const foldersMap = new Map<string, string>();

      const links = [];

      for (const item of selectedLinks) {
        if (item.metadata.kind !== "link") continue;
        const itemPath = item.metadata?.path;
        if (!itemPath) continue;

        // direct links
        if (itemPath === basePath) {
          links.push(mapItemToLink(item));
          continue;
        }

        // folder extraction
        const relative = basePath ? itemPath.replace(`${basePath}/`, "") : itemPath;
        const parts = relative.split("/").filter(Boolean);

        if (parts.length > 0) {
          const folder = parts[0];
          const folderPath = basePath ? `${basePath}/${folder}` : folder;

          foldersMap.set(folderPath, folder);
        }
      }

      return {
        folders: [...foldersMap.entries()].map(([path, folder]) => ({
          path,
          folder,
        })),
        links,
      };
    }),

  list: protectedProcedure
    .input(LinkSchemas.list.request)
    .output(LinkSchemas.list.response)
    .handler(async ({ input }) => {
      const { q, domain } = input;

      const filter = and(
        isNull(items.deletedAt),
        eq(items.platform, "chrome"),

        // 2. Conditional $or for 'q' (Title or URL search)
        q ? or(ilike(items.caption, `%${q}%`), ilike(items.url, `%${q}%`)) : undefined,

        // 3. Conditional search for 'domain'
        domain ? ilike(items.url, `%${domain}%`) : undefined,
      );

      const dataQuery = db.select().from(items);

      const countQuery = db.select({ count: count() }).from(items);

      const data = await withPagination({
        dataQuery,
        countQuery,
        filters: filter,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: items.createdAt,
        orderDirection: "desc",
      });

      return {
        ...data,
        items: data.items.map(mapItemToLink),
      };
    }),

  domains: protectedProcedure.output(LinkSchemas.domains.response).handler(async () => {
    const distinctRecords = await db
      .selectDistinct({ url: items.url })
      .from(items)
      .where(and(isNotNull(items.url), eq(items.platform, "chrome"), isNull(items.deletedAt)));

    const domainCountMap = new Map<string, number>();

    // 2. Process using your existing robust Node.js URL logic
    distinctRecords.forEach((record) => {
      try {
        // Drizzle returns objects like { url: '...' }, so we grab the string
        const { hostname } = new URL(record.url);
        const h = hostname.replace(/^www\./, "");

        if (h.length === 0) return;

        domainCountMap.set(h, (domainCountMap.get(h) || 0) + 1);
      } catch {
        // ignore invalid URLs that throw on new URL()
      }
    });

    return Array.from(domainCountMap.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  }),

  folders: protectedProcedure.output(LinkSchemas.folders.response).handler(async () => {
    const folders: PathNode[] = [];

    // 1. Fetch distinct paths from the database using Drizzle
    const distinctRecords = await db
      .selectDistinct({ path: sql<string>`(${items.metadata} -> 'path')` })
      .from(items)
      .where(and(isNotNull(items.url), eq(items.platform, "chrome"), isNull(items.deletedAt)));

    // 2. Map the result to an array of strings to match your existing logic
    const paths = distinctRecords.map((record) => record.path);

    // 3. Your exact existing tree-building logic
    for (const fullPath of paths) {
      const parts = fullPath.split("/").filter(Boolean);
      let currentLevel = folders;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let existingNode = currentLevel.find((node) => node.name === part);

        if (!existingNode) {
          existingNode = { path: `${parts.slice(0, i + 1).join("/")}`, name: part };
          currentLevel.push(existingNode);
        }

        // Only add children array if it's not the last element
        if (i < parts.length - 1) {
          if (!existingNode.children) existingNode.children = [];
          currentLevel = existingNode.children;
        }
      }
    }

    return folders;
  }),

  preview: protectedProcedure
    .input(LinkSchemas.preview.request)
    .errors({
      BAD_REQUEST: { message: "Failed to fetch link preview" },
      NOT_FOUND: { message: "Link not found" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const link = await db.query.items.findFirst({ where: eq(items.id, id) });

      if (link === undefined) throw errors.NOT_FOUND();

      // if (link?.preview) return link.preview;

      const { url } = link;

      try {
        // const data = await getLinkPreview(url);
        const response = await axios.get<string>(url, {
          responseType: "text",
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: () => true, // don't throw on non-200 status
        });

        const preFetched = {
          headers: { "content-type": String(response.headers["content-type"]) },
          status: response.status,
          url: url,
          data: response.data,
        };

        const data = await getPreviewFromContent(preFetched);

        const preview = {
          url: data.url,
          mediaType: data.mediaType,
          favicons: data.favicons,
          title: "title" in data ? data.title || undefined : undefined,
          charset: "charset" in data ? data.charset || undefined : undefined,
          siteName: "siteName" in data ? data.siteName || undefined : undefined,
          description: "description" in data ? data.description || undefined : undefined,
          contentType: "contentType" in data ? data.contentType || undefined : undefined,
          images: "images" in data ? data.images || undefined : undefined,
          videos: "videos" in data ? data.videos || undefined : undefined,
        };

        // await db.update(items).set({ preview: link.preview }).where(eq(items.id, id));

        return preview;
      } catch {
        throw errors.BAD_REQUEST();
      }
    }),

  move: protectedProcedure
    .input(LinkSchemas.move.request)
    .handler(async ({ input: { ids, path } }) => {
      const links = await db.query.items.findMany({ where: inArray(items.id, ids) });
      if (links.length === 0) throw new Error(`Links with ids ${ids.join(", ")} not found`);
      await db
        .update(items)
        .set({ metadata: sql`jsonb_set(${items.metadata}, '{path}', to_jsonb(${path}::text))` })
        .where(inArray(items.id, ids));
    }),

  delete: protectedProcedure
    .input(LinkSchemas.delete.request)
    .handler(async ({ input: { ids, hard } }) => {
      if (hard) {
        await db.delete(items).where(inArray(items.id, ids));
      } else {
        await db.update(items).set({ deletedAt: new Date() }).where(inArray(items.id, ids));
      }
    }),
};
