import { detectLanguage } from "@/utils/string";
import { usePostContext } from "../utils/context";

export function Caption() {
  const { caption } = usePostContext();
  const captionLang = detectLanguage(caption);

  return (
    <div>
      <h3 className="mb-1 font-medium text-sm">Caption</h3>
      <p
        className="wrap-break-word text-wrap text-sm"
        dir={captionLang === "arabic" ? "rtl" : "ltr"}
      >
        {caption || "No caption"}
      </p>
    </div>
  );
}
