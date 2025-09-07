import { createFileRoute } from "@tanstack/react-router";
import { SettingsLink } from "@/apps/settings/links";

export const Route = createFileRoute("/settings/links")({
  component: SettingsLink,
});
