import { Label } from "@workspace/ui/components/label";
import { useShallow } from "zustand/react/shallow";
import { XToggleGroup } from "@/components/form/toggle-group";
import ContentSection from "../components/content-section";
import { Delete } from "./delete";
import { useInstagramSettingStore } from "./use-store";

export default function SettingsInstagram() {
  const [virtual, setVirtual] = useInstagramSettingStore(
    useShallow((s) => [s.virtual, s.setVirtual]),
  );

  return (
    <ContentSection title="Instagram" desc="Manage your Instagram settings and preferences.">
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>Virtual List Mode</Label>
          <XToggleGroup
            value={virtual ? "virtual" : "non-virtual"}
            onChange={(v) => setVirtual(v === "virtual")}
            options={[
              { value: "virtual", label: "virtual", icon: "lucide:sort-asc" },
              { value: "non-virtual", label: "non-virtual", icon: "lucide:sort-desc" },
            ]}
          />
        </div>

        <div className="space-y-2">
          <p>Delete all data</p>
          <Delete />
        </div>
      </div>
    </ContentSection>
  );
}
