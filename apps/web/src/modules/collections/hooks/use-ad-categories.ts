import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { orpc } from "@/integrations/orpc";
import { listToTree } from "../utils";
import { pathLevels, pathTill } from "../utils/category-path";

type Options = {
  defaultPath?: string;
  depth?: number;
};

export function useCollection(options: Options = {}) {
  const { defaultPath = "", depth = 2 } = options;
  const qc = useQueryClient();

  const [activePath, setActivePath] = useState<string>(defaultPath);

  const placeholderData = useMemo(() => [], []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we are interested in changes to defaultPath only.
  useEffect(() => {
    if (defaultPath === undefined) return;
    if (defaultPath === activePath) return;
    setActivePath(defaultPath);
  }, [defaultPath]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to include defaultPath in the dependencies, because we only want to use it for the initial query, and not refetch when it changes.
  const defaultInput = useMemo(() => ({ depth, extraPath: pathTill(defaultPath, 1) }), [depth]);

  const rootQuery = useQuery(
    orpc.collection.list.queryOptions({
      input: defaultInput,
      staleTime: Number.POSITIVE_INFINITY,
      placeholderData,
    }),
  );

  const listData = mergeList(rootQuery.data, placeholderData);
  const treeData = useMemo(() => listToTree(listData), [listData]);

  // this is used to cheek if we are currently fetching data for the active node, to show a loading state in the UI.
  // const isFetching = useIsFetching({ queryKey: orpc.category.list.queryKey({ input: {} }) });

  const onClick = useCallback(
    async (path: string) => {
      // you can move the setActivePath after the fetch if you want to only set it when data is loaded,
      // but I prefer to set it immediately for better perceived performance,
      // and show a loading state in the UI for the active node until data is loaded.
      // since we are fetching data wit depth of 2, we will have the immediate children of the clicked node,
      // so we can show them as loading until they are loaded.

      setActivePath(path);

      const incoming = await qc.fetchQuery(
        orpc.collection.list.queryOptions({
          input: { path, depth: 2 },
          staleTime: Number.POSITIVE_INFINITY,
        }),
      );

      qc.setQueryData(orpc.collection.list.queryKey({ input: defaultInput }), (old) => {
        const existing = old ?? [];
        const merged = mergeList(existing, incoming);

        return merged;
      });
    },
    [qc, defaultInput],
  );

  const availableOptions = useCallback(
    (path: string) => {
      const segments = path ? path.split(".") : [];
      const nextLevel = segments.length;

      return listData.filter((o) => o.level === nextLevel && o.path.startsWith(path));
    },
    [listData],
  );

  const pathNode = (path: string) => {
    const parts = path.split(".");
    const levels = pathLevels(parts);
    return levels.map((p) => listData.find((o) => o.path === p)).filter((o) => o !== undefined);
  };

  const getNode = (path: string | string[] = "", index = 0) => {
    const p = Array.isArray(path) ? path.join(".") : path;
    const nodes = pathNode(p);

    // nodeA, nodeB, nodeC, nodeD

    // if index is 0 return nodeD, if its 1 return nodeC, if it's 2 return nodeB, if it's 3 return nodeA

    return nodes.at(-(index + 1));
  };

  const goBack = () => {
    const segments = activePath.split(".");
    if (segments.length === 0) return;
    const newPath = segments.slice(0, -1).join(".");
    setActivePath(newPath);
  };

  return {
    active: activePath,
    currentNode: getNode(activePath),
    data: treeData,
    list: listData,
    onClickHandler: onClick,
    pathArray: pathLevels(activePath),
    isLoading: rootQuery.isFetching,
    isLast: listData.filter((o) => o.path.startsWith(activePath)).length === 1,
    availableOptions,
    pathNode,
    getNode,
    goBack,
  };
}

function mergeList<T extends { id: string; path: string }>(existing: T[] = [], incoming: T[] = []) {
  const byId = new Map(existing.map((n) => [n.id, n]));
  for (const n of incoming) byId.set(n.id, n);
  return Array.from(byId.values()).sort((a, b) => a.path.localeCompare(b.path));
}
