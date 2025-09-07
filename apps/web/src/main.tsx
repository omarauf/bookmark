import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { queryClient } from "@/api/query-client";
import { orpc } from "./api/rpc";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

// Set up a Router instance
const router = createTanStackRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: { orpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface HistoryState {
    skipLoadingBar?: boolean;
  }
}

// Render the app
const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
