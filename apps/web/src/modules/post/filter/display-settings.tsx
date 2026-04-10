import { Grid, Layout, List, RectangleHorizontal, RectangleVertical, Square } from "lucide-react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDisplaySettingsStore } from "../controls/display-setting-store"; // Adjust path

export function DisplaySettingsMenu() {
  const store = useDisplaySettingsStore();

  const form = useAppForm({
    defaultValues: {
      layout: store.layout,
      cardSize: store.cardSize,
      aspectRatio: store.aspectRatio,
      thumbnailScale: store.thumbnailScale,
      showCardInfo: store.showCardInfo,
      titleLines: store.titleLines,
      flattenFolders: store.flattenFolders,
    },
    listeners: {
      onChange: ({ formApi }) => {
        const values = formApi.state.values;
        store.setState(values);
      },
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Layout />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4" align="start">
        <form.AppField name="layout">
          {(field) => (
            <field.ToggleGroup
              label="Layout"
              options={[
                { value: "grid", label: "Grid", icon: Grid },
                { value: "list", label: "List", icon: List },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="cardSize">
          {(field) => (
            <field.ToggleGroup
              label="Card Size"
              options={[
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="aspectRatio">
          {(field) => (
            <field.ToggleGroup
              label="Aspect Ratio"
              options={[
                { value: "landscape", icon: RectangleHorizontal },
                { value: "square", icon: Square },
                { value: "portrait", icon: RectangleVertical },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="thumbnailScale">
          {(field) => (
            <field.ToggleGroup
              label="Thumbnail Scale"
              options={[
                { value: "fit", label: "Fit" },
                { value: "fill", label: "Fill" },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="showCardInfo">
          {(field) => <field.Switch label="Show Card Info" />}
        </form.AppField>

        <form.Subscribe selector={(s) => s.values.showCardInfo}>
          {(showCardInfo) =>
            showCardInfo && (
              <form.AppField name="titleLines">
                {(field) => (
                  <field.Select
                    horizontal
                    label="Title Lines"
                    className="w-25"
                    options={[
                      { value: 1, label: "1 Line" },
                      { value: 2, label: "2 Lines" },
                      { value: 3, label: "3 Lines" },
                    ]}
                  />
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>

        <form.AppField name="flattenFolders">
          {(field) => <field.Switch label="Flatten Folders" />}
        </form.AppField>
      </PopoverContent>
    </Popover>
  );
}
