import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ORPCError } from "@orpc/server";
import type {
  CreateLink,
  Link,
  LinkPreview,
  ListLink,
  TreeLink,
  TreeNode,
} from "@workspace/contracts/link";
import axios from "axios";
import { getPreviewFromContent } from "link-preview-js";
import { countCharacter, trimAfterXCharacter } from "@/lib/string";
import { LinkModel } from "./model";

export const LinkService = {
  async tree({ path = "/" }: TreeLink) {
    const level = path === "/" ? 1 : path ? path.split("/").length : 0;

    const selectedLinks = await LinkModel.find({
      path: { $regex: `^${path}` },
      deletedAt: { $exists: false },
    }).sort({ createdAt: -1, _id: -1 });

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
    const links = selectedLinks.filter((link) => link.path === path);

    return { folders, links };
  },

  async list({ q, limit = 10, page = 1, domain }: ListLink) {
    const skip = (page - 1) * limit;
    const filter = {
      deletedAt: { $exists: false },
      ...(q
        ? {
            $or: [{ title: { $regex: q, $options: "i" } }, { url: { $regex: q, $options: "i" } }],
          }
        : {}),
      ...(domain ? { url: { $regex: domain, $options: "i" } } : {}),
    };

    const [items, total] = await Promise.all([
      LinkModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1, _id: -1 }),
      LinkModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  },

  async domains() {
    const urls = await LinkModel.find({}, { url: 1, _id: 0 }).distinct("url");
    const domainCountMap = new Map<string, number>();

    urls.forEach((url) => {
      try {
        const { hostname } = new URL(url);
        const h = hostname.replace(/^www\./, "");
        if (h.length === 0) return;
        domainCountMap.set(h, (domainCountMap.get(h) || 0) + 1);
      } catch {
        // ignore invalid URLs
      }
    });

    return Array.from(domainCountMap.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  },

  async folders() {
    const folders: TreeNode[] = [];

    const paths = await LinkModel.find({}, { path: 1, _id: 0 }).distinct("path");
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
  },

  async create(importedLinks: CreateLink | CreateLink[]) {
    if (!Array.isArray(importedLinks)) {
      const existingLink = await LinkModel.findOne({ url: importedLinks.url }).exec();
      if (existingLink) return;

      const createdLink = new LinkModel({
        ...importedLinks,
        createdAt: importedLinks.createdAt || new Date(),
      });
      return await createdLink.save();
    }

    for (const link of importedLinks) {
      const existingLink = await LinkModel.findOne({ url: link.url, path: link.path }).exec();
      if (existingLink) continue;

      const createdLink = new LinkModel({
        ...link,
        createdAt: link.createdAt || new Date(),
      });
      await createdLink.save();
    }
  },

  async move(ids: string[], targetPath: string): Promise<Link[]> {
    const links = await LinkModel.find({ _id: { $in: ids } });
    if (links.length === 0) throw new Error(`Links with ids ${ids.join(", ")} not found`);
    await LinkModel.updateMany({ _id: { $in: ids } }, { $set: { path: targetPath } });
    return links;
  },

  async delete(ids: string[], hard: boolean) {
    if (hard) {
      await LinkModel.deleteMany({ _id: { $in: ids } }).exec();
    } else {
      await LinkModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date() } }).exec();
    }
  },

  async favicon(domain: string) {
    const ROOT_DIR = path.resolve(process.cwd());
    const LINKS_DIR = path.join(ROOT_DIR, "src", "data", "links");
    const fileName = `${domain}.png`;
    const filePath = path.join(LINKS_DIR, fileName);

    try {
      // Check if the favicon already exists
      await access(filePath);
      return filePath;
    } catch {}

    // File doesn't exist, proceed to download
    const imageUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(domain)}`;

    try {
      const response = await axios.get<ArrayBuffer>(imageUrl, { responseType: "arraybuffer" });

      // Ensure the directory exists
      await mkdir(LINKS_DIR, { recursive: true });

      // Write file to disk
      await writeFile(filePath, Buffer.from(response.data));
      return filePath;
    } catch {
      throw new ORPCError("BAD_REQUEST", {
        message: `Failed to download favicon for domain: ${domain}`,
      });
    }
  },

  async preview(id: string): Promise<LinkPreview> {
    const link = await LinkModel.findById(id);

    if (link === null)
      throw new ORPCError("NOT_FOUND", { message: `Link with id ${id} not found` });

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

      await link.save();

      return link.preview;
    } catch {
      throw new ORPCError("BAD_REQUEST", { message: `Failed to fetch preview for url ${url}` });
    }
  },
};
