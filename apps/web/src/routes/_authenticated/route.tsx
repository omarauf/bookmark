import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/layout/search/search-provider";
import { AppSidebar } from "@/layout/sidebar";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@/settings/context/direction-provider";
import { LayoutProvider } from "@/settings/context/layout-provider";
import { ThemeProvider } from "@/theme/theme-provider";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    // const { data } = await authClient.getSession();
    // if (data?.user == null) {
    //   throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    // }
    // if (data.user.role !== "admin") {
    //   await authClient.signOut();
    //   throw redirect({ to: "/403" });
    // }
  },
});

type Props = {
  children?: React.ReactNode;
};

function AuthenticatedLayout({ children }: Props) {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        <SearchProvider>
          <LayoutProvider>
            <SidebarProvider>
              <AppSidebar />

              <SidebarInset
                className={cn(
                  // Set content container, so we can use container queries
                  "@container/content",

                  // If layout is fixed, set the height
                  // to 100svh to prevent overflow
                  "has-data-[layout=fixed]:h-svh",

                  // If layout is fixed and sidebar is inset,
                  // set the height to 100svh - spacing (total margins) to prevent overflow
                  "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
                )}
              >
                <DirectionProvider>{children ?? <Outlet />}</DirectionProvider>
              </SidebarInset>
            </SidebarProvider>
          </LayoutProvider>
        </SearchProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
