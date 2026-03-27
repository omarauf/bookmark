import { LinkSchemas, type TreeNode } from "@workspace/contracts/link";
import axios from "axios";
import { and, count, desc, eq, ilike, inArray, isNotNull, isNull, like, or } from "drizzle-orm";
import { getPreviewFromContent } from "link-preview-js";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { s3Client } from "@/core/s3";
import { publicProcedure } from "@/lib/orpc";
import { countCharacter, trimAfterXCharacter } from "@/lib/string";
import { links } from "./schema";

export const linkRouter = {
  tree: publicProcedure
    .input(LinkSchemas.tree.request)
    .output(LinkSchemas.tree.response)
    .handler(async ({ input }) => {
      const { path } = input;
      const level = path === "/" ? 1 : path ? path.split("/").length : 0;

      const selectedLinks = await db.query.links.findMany({
        where: and(
          // Equivalent to $regex: `^${path}` (starts with)
          like(links.path, `${path}%`),
          // Equivalent to $exists: false (assuming this means the field is null)
          isNull(links.deletedAt),
        ),
        orderBy: [desc(links.createdAt), desc(links.id)],
      });

      const results = new Map<string, string>();
      // selectedLinks
      //   .map((l) => l.path)
      //   .filter((link) => link.startsWith(p))
      //   .filter((link) => countCharacter("/", link) >= level)
      //   .map((l) => trimAfterXCharacter(l, level + 1, "/"))
      //   .forEach((f) => results.set(f, f.replace(p, "")));
      selectedLinks.forEach((link) => {
        const { path } = link;
        if (path.startsWith(path) && countCharacter("/", path) >= level) {
          const folderPath = trimAfterXCharacter(path, level + 1, "/");
          if (results.has(folderPath)) return;
          results.set(folderPath, folderPath.replace(path, "").replace(/^\/+/, ""));
        }
      });

      const folders = [...results].map(([path, folder]) => ({ path, folder }));
      const _links = selectedLinks.filter((link) => link.path === path);

      return {
        folders,
        links: _links.map((item) => ({
          ...item,
          title: item.title || undefined,
          deletedAt: item.deletedAt || undefined,
          preview: item.preview || undefined,
        })),
      };
    }),

  list: publicProcedure
    .input(LinkSchemas.list.request)
    .output(LinkSchemas.list.response)
    .handler(async ({ input }) => {
      const { q, domain } = input;

      const filter = and(
        isNull(links.deletedAt),

        // 2. Conditional $or for 'q' (Title or URL search)
        q ? or(ilike(links.title, `%${q}%`), ilike(links.url, `%${q}%`)) : undefined,

        // 3. Conditional search for 'domain'
        domain ? ilike(links.url, `%${domain}%`) : undefined,
      );

      const dataQuery = db.select().from(links);

      const countQuery = db.select({ count: count() }).from(links);

      const data = await withPagination({
        dataQuery,
        countQuery,
        filters: filter,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: links.createdAt,
        orderDirection: "desc",
      });

      return {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          title: item.title || undefined,
          deletedAt: item.deletedAt || undefined,
          preview: item.preview || undefined,
        })),
      };
    }),

  domains: publicProcedure.output(LinkSchemas.domains.response).handler(async () => {
    const distinctRecords = await db
      .selectDistinct({ url: links.url })
      .from(links)
      .where(isNotNull(links.url));

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

  folders: publicProcedure.handler(async () => {
    const folders: TreeNode[] = [];

    // 1. Fetch distinct paths from the database using Drizzle
    const distinctRecords = await db
      .selectDistinct({ path: links.path })
      .from(links)
      .where(isNotNull(links.path)); // Safeguard against null paths

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
          existingNode = { path: `/${parts.slice(0, i + 1).join("/")}`, name: part };
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

  create: publicProcedure
    .input(LinkSchemas.create.request)
    .output(LinkSchemas.create.response)
    .handler(async ({ input }) => {
      // if (!Array.isArray(input)) {
      //   const existingLink = await db.query.links.findFirst({
      //     where: eq(links.url, input.url),
      //   });

      //   if (existingLink) return;

      //   const [createdLink] = await db
      //     .insert(links)
      //     .values({
      //       ...input,
      //       createdAt: input.createdAt || new Date(),
      //     })
      //     .returning(); // .returning() gets the saved record back

      //   return createdLink;
      // }

      for (const link of input) {
        const existingLink = await db.query.links.findFirst({
          where: and(eq(links.url, link.url), eq(links.path, link.path)),
        });

        if (existingLink) continue;
        const domain = new URL(link.url).hostname.replace(/^www\./, "");
        const imageUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(domain)}`;
        const response = await axios.get<ArrayBuffer>(imageUrl, { responseType: "arraybuffer" });

        await s3Client.upload(`links/${domain}.png`, Buffer.from(response.data));

        await db.insert(links).values({
          ...link,
          createdAt: link.createdAt || new Date(),
        });
      }
    }),

  preview: publicProcedure
    .input(LinkSchemas.preview.request)
    .errors({
      BAD_REQUEST: { message: "Failed to fetch link preview xx" },
      NOT_FOUND: { message: "Link not found xx" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const link = await db.query.links.findFirst({ where: eq(links.id, id) });

      if (link === undefined) throw errors.NOT_FOUND();

      if (link?.preview) return link.preview;

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

        link.preview = {
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

        await db.update(links).set({ preview: link.preview }).where(eq(links.id, id));

        return link.preview;
      } catch {
        throw errors.BAD_REQUEST();
      }
    }),

  move: publicProcedure
    .input(LinkSchemas.move.request)
    .handler(async ({ input: { ids, path } }) => {
      const items = await db.query.links.findMany({ where: inArray(links.id, ids) });
      if (items.length === 0) throw new Error(`Links with ids ${ids.join(", ")} not found`);
      await db.update(links).set({ path }).where(inArray(links.id, ids));
      return items;
    }),

  delete: publicProcedure
    .input(LinkSchemas.delete.request)
    .handler(async ({ input: { ids, hard } }) => {
      if (hard) {
        await db.delete(links).where(inArray(links.id, ids));
      } else {
        await db.update(links).set({ deletedAt: new Date() }).where(inArray(links.id, ids));
      }
    }),
};
