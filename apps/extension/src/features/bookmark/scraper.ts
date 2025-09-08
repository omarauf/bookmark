import type { CreateLink } from "@workspace/contracts/link";
import { client } from "@/api/rpc";

export const scrapeChromeBookmark = async () => {
  interface FlattenedBookmark extends chrome.bookmarks.BookmarkTreeNode {
    folder: string;
    title: string;
    path: string;
  }

  const result: FlattenedBookmark[] = [];

  const bookmarkTreeNodes = await chrome.bookmarks.getTree();

  const traverse = (items?: chrome.bookmarks.BookmarkTreeNode[], path: string[] = []) => {
    if (!items) return;

    for (const item of items) {
      // If it’s a folder (has children), recurse
      if ("children" in item && Array.isArray(item.children)) {
        const currentPath = [...path, item.title];
        traverse(item.children, currentPath);
      }

      // If it’s a bookmark (has a URL), add to result
      if ("url" in item && item.url) {
        result.push({
          ...item,
          folder: path[path.length - 1] || "",
          title: item.title,
          path: path.join("/"),
        });
      }
    }
  };

  for (const bookmark of bookmarkTreeNodes) {
    traverse(bookmark.children, [bookmark.title]);
  }

  const importedLink: CreateLink[] = result
    .filter((l) => l.url)
    .filter((l) => l.url?.startsWith("http"))
    .map((l) => ({
      createdAt: l.dateAdded ? new Date(l.dateAdded) : undefined,
      folder: l.folder,
      path: l.path,
      title: l.title,
      url: String(l.url),
    }));

  await client.links.create(importedLink);
};
