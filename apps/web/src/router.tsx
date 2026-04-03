import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { orpc } from "./integrations/orpc";
import TanStackQueryProvider, { getContext } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const { queryClient } = getContext();

  const router = createTanStackRouter({
    routeTree,

    context: { orpc, queryClient },

    defaultNotFoundComponent: () => <div>Not found</div>,
    defaultErrorComponent: ({ error }) => <div>{`Error: ${error.message}`}</div>,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanStackQueryProvider queryClient={queryClient}>{props.children}</TanStackQueryProvider>
      );
    },

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface HistoryState {
    skipLoadingBar?: boolean;
  }
}
