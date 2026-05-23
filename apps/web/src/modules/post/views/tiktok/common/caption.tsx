import { useState } from "react";
import { detectLanguage } from "@/utils/string";
import { usePostContext } from "./context";

const MAX_LENGTH = 90;

type Props = {
  className?: string;
};

export function Caption({ className }: Props) {
  const { caption } = usePostContext();
  const [expanded, setExpanded] = useState(false);
  const captionLang = detectLanguage(caption);

  if (!caption) return null;

  const isLong = caption.length > MAX_LENGTH;
  const displayCaption = expanded || !isLong ? caption : `${caption.slice(0, MAX_LENGTH)}...`;

  return (
    <div dir={captionLang === "arabic" ? "rtl" : "ltr"} className={className}>
      <p className="wrap-break-word text-wrap text-sm leading-relaxed">
        {displayCaption}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ml-1 inline font-semibold opacity-80 hover:opacity-100"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </p>
    </div>
  );
}
