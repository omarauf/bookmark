import { Root as Radio } from "@radix-ui/react-radio-group";
import { IconSidebarFloating } from "@/assets/custom/icon-sidebar-floating";
import { IconSidebarInset } from "@/assets/custom/icon-sidebar-inset";
import { IconSidebarSidebar } from "@/assets/custom/icon-sidebar-sidebar";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";
import { getVariantControls, useSettingStore } from "./hooks/use-store";

export function SidebarConfig() {
  const { isChanged, reset, setValue } = getVariantControls();
  const variant = useSettingStore((s) => s.variant);

  return (
    <div className="space-y-2 max-md:hidden">
      <SectionTitle title="Sidebar" showReset={isChanged()} onReset={reset} />
      <Radio
        value={variant}
        onValueChange={setValue}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          {
            value: "inset",
            label: "Inset",
            icon: IconSidebarInset,
          },
          {
            value: "floating",
            label: "Floating",
            icon: IconSidebarFloating,
          },
          {
            value: "sidebar",
            label: "Sidebar",
            icon: IconSidebarSidebar,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <p className="text-muted-foreground text-sm">
        Choose between inset, floating, or standard sidebar layout
      </p>
    </div>
  );
}
