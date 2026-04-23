import { useNavigate } from "@tanstack/react-router";
import { FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  name: string;
  path: string;
};

export function FolderCard({ name, path, className }: Props) {
  const navigate = useNavigate({ from: "/links/" });

  const onClickHandler = () => navigate({ to: ".", search: { view: "tree", path } });

  return (
    <button
      type="button"
      onClick={onClickHandler}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <FolderIcon className="h-8 w-8 text-primary" />
      <span className="line-clamp-2 max-w-full text-center font-medium text-sm">{name}</span>
    </button>
  );
}
