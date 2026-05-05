import {
  AudioWaveform,
  Clapperboard,
  Command,
  Construction,
  Download,
  FileQuestion,
  Folder,
  GalleryVerticalEnd,
  Layers,
  Link,
  ServerCrash,
  Settings,
  ShieldAlert,
  ShieldBan,
  Tags,
  Tv,
  Upload,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { InstagramIcon, TwitterIcon } from "@/assets/icons";
import type { SidebarData } from "./types";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "Content",
      items: [
        { title: "Links", url: "/links", icon: Link },
        { title: "Collections", url: "/collections", icon: Folder },
        { title: "Tags", url: "/tags", icon: Tags },
      ],
    },
    {
      title: "Social",
      items: [
        { title: "Instagram", url: "/instagram", icon: InstagramIcon },
        { title: "Twitter", url: "/twitter", icon: TwitterIcon },
        { title: "TikTok", url: "/tiktok", icon: Video },
      ],
    },
    {
      title: "Entertainment",
      items: [
        { title: "IMDb", url: "/imdb", icon: Clapperboard },
        { title: "Anime", url: "/anime", icon: Tv },
      ],
    },
    {
      title: "Data & Operations",
      items: [
        { title: "Imports", url: "/imports", icon: Upload },
        { title: "Downloads", url: "/downloads", icon: Download },
        { title: "Jobs", url: "/jobs", icon: Workflow },
        { title: "Job Groups", url: "/job-groups", icon: Layers },
        { title: "File Manager", url: "/file-manager", icon: Folder },
      ],
    },
    {
      title: "Management",
      items: [{ title: "Users", url: "/users", icon: Users }],
    },
    {
      title: "System",
      items: [
        {
          title: "Pages",
          icon: ShieldAlert,
          items: [
            { title: "Unauthorized", url: "/401", icon: ShieldBan },
            { title: "Forbidden", url: "/403", icon: ShieldBan },
            { title: "Not Found", url: "/404", icon: FileQuestion },
            { title: "Internal Server Error", url: "/500", icon: ServerCrash },
            { title: "Maintenance", url: "/503", icon: Construction },
          ],
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};
