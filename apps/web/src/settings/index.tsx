import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppearance } from "@/settings/context/appearance-provider";
import { useDirection } from "@/settings/context/direction-provider";
import { useStyle } from "@/settings/context/style-provider";
import { useTheme } from "@/theme/theme-provider";
import { useSidebar } from "../components/ui/sidebar";
import { AppearanceConfig } from "./appearance";
import { useLayout } from "./context/layout-provider";
import { DirConfig } from "./direction";
import { LayoutConfig } from "./layout";
import { SidebarConfig } from "./sidebar";
import { StyleConfig } from "./style";
import { ThemeConfig } from "./theme";

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetDir } = useDirection();
  const { resetTheme } = useTheme();
  const { resetLayout } = useLayout();
  const { resetStyle } = useStyle();
  const { resetAppearance } = useAppearance();

  const handleReset = () => {
    setOpen(true);
    resetTheme();
    resetDir();
    resetLayout();
    resetStyle();
    resetAppearance();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <StyleConfig />
          <AppearanceConfig />
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            aria-label="Reset all settings to default values"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
