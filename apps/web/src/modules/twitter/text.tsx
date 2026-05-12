import { cn } from "@/lib/utils";
import { detectLanguage } from "@/utils/string";

type Props = {
  text?: string;
  className?: string;
};

export function TwitterText({ text, className }: Props) {
  if (!text) return null;

  return (
    <div
      className={cn("text-sm", className)}
      dir={detectLanguage(text) === "arabic" ? "rtl" : "ltr"}
    >
      {text?.split("\n").map((line, i) => (line === "" ? <br key={i} /> : <p key={i}>{line}</p>))}
    </div>
  );
}
