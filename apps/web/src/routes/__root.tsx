import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { Toaster } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import Cookies from "js-cookie";
import type { orpc } from "@/api/rpc";
import { NavigationProgress } from "@/components/navigation-progress";
import { FontProvider } from "@/context/font-context";
import { SearchProvider } from "@/layouts/search";
import { AppSidebar } from "@/layouts/sidebar";
import GeneralError from "@/pages/errors/general-error";
import NotFoundError from "@/pages/errors/not-found-error";
import { ThemeProvider } from "@/theme";

import "../index.css";

interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: () => {
    const defaultOpen = Cookies.get("sidebar_state") !== "false";

    return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <FontProvider>
          <NavigationProgress />
          <SearchProvider>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <div
                // id="content"
                className={cn(
                  "ml-auto w-full max-w-full",
                  "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
                  "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
                  "sm:transition-[width] sm:duration-200 sm:ease-linear",
                  // "flex h-svh flex-col",
                  "group-data-[scroll-locked=1]/body:h-full",
                  "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh",
                )}
              >
                <Outlet />
              </div>
            </SidebarProvider>
          </SearchProvider>
          <Toaster duration={3000} position="top-right" />
          {import.meta.env.MODE === "development" && (
            <>
              <ReactQueryDevtools buttonPosition="bottom-right" />
              <TanStackRouterDevtools position="bottom-right" />
            </>
          )}
        </FontProvider>
      </ThemeProvider>
    );
  },
  head: () => ({
    meta: [
      {
        title: "my-better-t-app",
      },
      {
        name: "description",
        content: "my-better-t-app is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});

// function RootComponent() {
//   const isFetching = useRouterState({
//     select: (s) => s.isLoading,
//   });

//   return (
//     <>
//       <HeadContent />
//       <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
//         <div className="grid h-svh grid-rows-[auto_1fr]">
//           <Header />
//           {isFetching ? <Loader /> : <Outlet />}
//         </div>
//         <Toaster richColors />
//       </ThemeProvider>
//       <TanStackRouterDevtools position="bottom-left" />
//       <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
//     </>
//   );
// }
