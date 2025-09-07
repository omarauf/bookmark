import { isDefinedError } from "@orpc/client";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isDefinedError(error)) {
          // Don't retry on defined errors
          return false;
        }
        // Retry up to 3 times otherwise
        return failureCount < 3;
      },
    },
  },
});
