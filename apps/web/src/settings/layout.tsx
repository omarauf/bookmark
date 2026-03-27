import { Root as Radio } from "@radix-ui/react-radio-group";
import { IconLayoutCompact } from "@/assets/custom/icon-layout-compact";
import { IconLayoutDefault } from "@/assets/custom/icon-layout-default";
import { IconLayoutFull } from "@/assets/custom/icon-layout-full";
import { type Collapsible, useLayout } from "@/settings/context/layout-provider";
import { useSidebar } from "../components/ui/sidebar";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";

export function LayoutConfig() {
  const { open, setOpen } = useSidebar();
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout();

  const radioState = open ? "default" : collapsible;

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Layout"
        showReset={radioState !== "default"}
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
      />
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === "default") {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as Collapsible);
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          {
            value: "default",
            label: "Default",
            icon: IconLayoutDefault,
          },
          {
            value: "icon",
            label: "Compact",
            icon: IconLayoutCompact,
          },
          {
            value: "offcanvas",
            label: "Full layout",
            icon: IconLayoutFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div>Choose between default expanded, compact icon-only, or full layout mode</div>
    </div>
  );
}
