import { createFileRoute } from "@tanstack/react-router";
import SettingsInstagram from "@/apps/settings/instagram";

export const Route = createFileRoute("/settings/instagram")({
  component: SettingsInstagram,
});
