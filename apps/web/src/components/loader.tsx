import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function Loader({ className }: Props) {
  return (
    <div className={cn("flex h-full items-center justify-center pt-8", className)}>
      <Loader2 className="animate-spin" />
    </div>
  );
}
