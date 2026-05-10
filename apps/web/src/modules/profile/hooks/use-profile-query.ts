import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { orpc } from "@/integrations/orpc";

export function useProfileQuery() {
  const search = useSearch({ from: "/_authenticated/profiles/" });
  const queryClient = useQueryClient();

  const query = useInfiniteQuery(
    orpc.profile.list.infiniteOptions({
      initialPageParam: 1,
      input: (page) => ({
        platform: search.platform,
        username: search.username,
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
        page,
        perPage: 40,
      }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }),
  );

  const resetInfiniteQueryPagination = useCallback(() => {
    const keys = orpc.profile.list.infiniteKey({
      initialPageParam: 1,
      input: (page) => ({
        platform: search.platform,
        username: search.username,
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
        page,
        perPage: 40,
      }),
    });

    queryClient.setQueryData(keys, (oldData) => {
      if (!oldData) return undefined;
      return {
        ...oldData,
        pages: oldData.pages.slice(0, 1),
        pageParams: oldData.pageParams.slice(0, 1),
      };
    });
  }, [queryClient, search]);

  useEffect(() => {
    return () => resetInfiniteQueryPagination();
  }, [resetInfiniteQueryPagination]);

  return query;
}
