import type { ImportPayload } from "@workspace/contracts/import";
import { type CreateItem, ItemSchemas } from "@workspace/contracts/item";
import type { Platform } from "@workspace/contracts/platform";
import type { PlatformHandler } from "@/core/platform";
import { jsonParse } from "@/utils/object";

export class ChromeHandler implements PlatformHandler {
  platform: Platform = "chrome";

  validate(rawData: string): { valid: number; invalid: number } {
    const bookmarkTree = jsonParse<chrome.bookmarks.BookmarkTreeNode[]>(rawData) || [];

    const { validItems, invalidItems } = this.processBookmarks(bookmarkTree);

    return { valid: validItems.length, invalid: invalidItems.length };
  }

  handler(rawData: string): ImportPayload {
    const bookmarkTree = jsonParse<chrome.bookmarks.BookmarkTreeNode[]>(rawData) || [];

    if (!bookmarkTree) {
      return { items: [], invalidItems: [], relations: [], downloadTasks: [] };
    }

    const { validItems, invalidItems } = this.processBookmarks(bookmarkTree);

    return {
      items: validItems,
      invalidItems,
      relations: [],
      downloadTasks: [],
    };
  }

  private processBookmarks(bookmarkTree: chrome.bookmarks.BookmarkTreeNode[]) {
    const collectedItems: CreateItem[] = [];

    for (const rootNode of bookmarkTree) {
      this.traverseBookmarks(rootNode.children, [rootNode.title], collectedItems);
    }

    const validItems: CreateItem[] = [];
    const invalidItems: CreateItem[] = [];

    for (const item of collectedItems) {
      const parseResult = ItemSchemas.create.safeParse(item);

      if (!parseResult.success) {
        invalidItems.push(item);
      } else {
        validItems.push(parseResult.data);
      }
    }

    return { validItems, invalidItems };
  }

  private traverseBookmarks(
    nodes: chrome.bookmarks.BookmarkTreeNode[] | undefined,
    currentPath: string[],
    collectedItems: CreateItem[],
  ): void {
    if (!nodes) return;

    for (const node of nodes) {
      if (Array.isArray(node.children)) {
        this.traverseBookmarks(node.children, [...currentPath, node.title], collectedItems);
      }

      if (node.url) {
        let path = currentPath.join("/");
        if (path.startsWith("/")) path = path.slice(1);

        collectedItems.push({
          kind: "link",
          platform: "chrome",
          url: String(node.url),
          externalId: node.id,
          caption: node.title,
          createdAt: node.dateAdded ? new Date(node.dateAdded) : undefined,
          metadata: {
            kind: "link",
            platform: "chrome",
            lastUsedAt: node.dateLastUsed ? new Date(node.dateLastUsed) : undefined,
            path,
          },
        });
      }
    }
  }
}
