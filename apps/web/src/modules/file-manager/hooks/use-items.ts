import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { BrowseItem, File, Folder } from "@workspace/contracts/file-manager";
import { useCallback, useMemo } from "react";
import { orpc } from "@/integrations/orpc";

export function useItems() {
  const folderId = useSearch({ from: "/_authenticated/file-manager/", select: (s) => s.folderId });

  const browseListQuery = useQuery(
    orpc.browse.list.queryOptions({ input: { parentId: folderId } }),
  );

  const items = useMemo(
    () => mapToItem(browseListQuery.data?.folders, browseListQuery.data?.files),
    [browseListQuery.data],
  );

  const getItemData = useCallback((id: string) => items.find((item) => item.id === id), [items]);

  const getItemsData = useCallback(
    (ids: string[]) => items.filter((item) => ids.includes(item.id)),
    [items],
  );

  return { items, getItemData, getItemsData };
}

function mapToItem(folders: Folder[] = [], files: File[] = []): BrowseItem[] {
  const folderItems: BrowseItem[] = folders.map((folder) => ({
    ...folder,
    type: "folder",
  }));

  return [...folderItems, ...files];
}
