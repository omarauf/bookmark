import type { LogLevel } from "@workspace/contracts/job";
import { AlertTriangle, Bug, Info, X } from "lucide-react";

export const levelIcons = {
  debug: <Bug className="size-3.5 text-muted-foreground" />,
  info: <Info className="size-3.5 text-blue-500" />,
  warn: <AlertTriangle className="size-3.5 text-amber-500" />,
  error: <X className="size-3.5 text-destructive" />,
};

export const logLevelColors: Record<LogLevel, string> = {
  debug: "bg-slate-400",
  info: "bg-blue-400",
  warn: "bg-amber-400",
  error: "bg-rose-500",
};
