import { ImageIcon } from "lucide-react";
import { useId, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

export function FileImageUploadField(props: FormControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const field = useFieldContext<File | undefined>();
  const id = useId();

  const name = useMemo(() => {
    const value = field.state.value;
    if (value && "name" in value) return value.name;

    return value || "No file selected, Click to upload an image";
  }, [field.state.value]);

  return (
    <FormBase id={id} {...props}>
      <div
        aria-hidden="true"
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-slate-200 border-dashed p-6 text-center transition-colors hover:bg-slate-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="mb-3 rounded-full bg-slate-100 p-3">
          <ImageIcon className="h-6 w-6 text-slate-500" />
        </div>
        <h4 className="mb-1 font-semibold text-slate-900">{name}</h4>
        <p className="max-w-xs text-slate-500 text-sm">
          {field.state.value
            ? `Size: ${(field.state.value.size / 1024 / 1024).toFixed(2)} MB`
            : "SVG, PNG, JPG or GIF (max. 800x400px)"}
        </p>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              field.handleChange(e.target.files[0]);
            } else {
              field.handleChange(undefined);
            }
          }}
        />
      </div>
      {field.state.value && (
        <div className="mt-4 flex justify-end">
          <Button variant="destructive" size="sm" onClick={() => field.handleChange(undefined)}>
            Remove File
          </Button>
        </div>
      )}
    </FormBase>
  );
}
