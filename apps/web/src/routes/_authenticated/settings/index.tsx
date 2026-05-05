import { createFileRoute } from "@tanstack/react-router";
import { AppearanceConfig } from "@/settings/appearance";
import { DirConfig } from "@/settings/direction";
import { LayoutConfig } from "@/settings/layout";
import { SidebarConfig } from "@/settings/sidebar";
import { StyleConfig } from "@/settings/style";
import { ThemeConfig } from "@/settings/theme";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto space-y-8">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your appearance, layout, and interface preferences.
          </p>
        </div>

        <StyleConfig />
        <AppearanceConfig />

        <div className="grid grid-cols-4 gap-6">
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
      </div>
    </div>
  );
}
