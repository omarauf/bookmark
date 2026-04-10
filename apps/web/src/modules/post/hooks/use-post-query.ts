import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { orpc } from "@/integrations/orpc";

export function usePostQuery() {
  const search = useSearch({ from: "/_authenticated/instagram/" });
  const queryClient = useQueryClient();

  const postQuery = useInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, platform: "instagram" }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }),
  );

  const resetInfiniteQueryPagination = useCallback(() => {
    const keys = orpc.post.list.infiniteKey({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, platform: "instagram" }),
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

  return postQuery;
}
