import { Label } from "@workspace/ui/components/label";
import { useShallow } from "zustand/react/shallow";
import { XToggleGroup } from "@/components/form/toggle-group";
import ContentSection from "../components/content-section";
import { useLinkSettingStore } from "./use-store";

export function SettingsLink() {
  const [popup, setPopup] = useLinkSettingStore(useShallow((s) => [s.popup, s.setPopup]));

  return (
    <ContentSection title="Link" desc="Manage your Link settings and preferences.">
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>Popup Mode</Label>
          <XToggleGroup
            value={popup ? "popup" : "non-popup"}
            onChange={(v) => setPopup(v === "popup")}
            options={[
              { value: "popup", label: "popup" },
              { value: "non-popup", label: "non-popup" },
            ]}
          />
        </div>
      </div>
    </ContentSection>
  );
}
