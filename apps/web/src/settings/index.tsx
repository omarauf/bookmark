import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/theme/theme-provider";
import { useSidebar } from "../components/ui/sidebar";
import { AppearanceConfig } from "./appearance";
import { DirConfig } from "./direction";
import {
  getAppearanceControls,
  getCollapsibleControls,
  getDirectionControls,
  getStyleControls,
} from "./hooks/use-store";
import { LayoutConfig } from "./layout";
import { SidebarConfig } from "./sidebar";
import { StyleConfig } from "./style";
import { ThemeConfig } from "./theme";

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetTheme } = useTheme();

  const collapsibleControls = getCollapsibleControls();
  const variantControls = getCollapsibleControls();
  const directionControls = getDirectionControls();
  const styleControls = getStyleControls();
  const appearanceControls = getAppearanceControls();

  const handleReset = () => {
    setOpen(true);
    resetTheme();
    directionControls.reset();
    variantControls.reset();
    collapsibleControls.reset();
    styleControls.reset();
    appearanceControls.reset();
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

        <ScrollArea className="min-h-0 ">
          <div className="px-4 space-y-4">
            <StyleConfig />
            <AppearanceConfig />
            <ThemeConfig />
            <SidebarConfig />
            <LayoutConfig />
            <DirConfig />
          </div>
        </ScrollArea>
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
