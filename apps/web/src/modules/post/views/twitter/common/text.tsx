import { cn } from "@/lib/utils";
import { detectLanguage } from "@/utils/string";

type Props = {
  text?: string;
  className?: string;
};

export function TwitterText({ text, className }: Props) {
  if (!text) return null;

  const result = text.endsWith("\n") ? text.slice(0, -1) : text;

  return (
    <p
      className={cn("whitespace-pre-line text-sm", className)}
      dir={detectLanguage(text) === "arabic" ? "rtl" : "ltr"}
    >
      {result}
    </p>
  );
}
