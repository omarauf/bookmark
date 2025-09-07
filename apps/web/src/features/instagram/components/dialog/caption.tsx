import { detectLanguage } from "@/utils/string";

export function RenderCaption({ caption }: { caption?: string }) {
  const captionLang = detectLanguage(caption || "No caption");

  return (
    <div>
      <h3 className="mb-1 font-medium text-sm">Caption</h3>
      <p className="text-wrap break-words text-sm" dir={captionLang === "arabic" ? "rtl" : "ltr"}>
        {caption || "No caption"}
      </p>
    </div>
  );
}
