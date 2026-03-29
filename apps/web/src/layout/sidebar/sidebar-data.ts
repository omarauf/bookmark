import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
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
      title: "General",
      items: [
        {
          title: "Links",
          url: "/links",
        },
        {
          title: "Instagram",
          url: "/instagram",
        },
        {
          title: "Twitter",
          url: "/twitter",
        },
        {
          title: "Tiktok",
          url: "/tiktok",
        },
        {
          title: "Collections",
          url: "/collections",
        },
        {
          title: "Tags",
          url: "/tags",
        },
        {
          title: "Imports",
          url: "/imports",
        },
        {
          title: "Downloads",
          url: "/downloads",
        },
        {
          title: "Users",
          url: "/users",
        },
      ],
    },
    {
      title: "Pages",
      items: [
        // {
        //   title: "Auth",
        //   // icon: IconLockAccess,
        //   items: [
        //     {
        //       title: "Sign In",
        //       url: "/sign-in",
        //     },
        //     {
        //       title: "Sign Up",
        //       url: "/sign-up",
        //     },
        //     {
        //       title: "Forgot Password",
        //       url: "/forgot-password",
        //     },
        //   ],
        // },
        {
          title: "Errors",
          // icon: IconBug,
          items: [
            {
              title: "Unauthorized",
              url: "/401",
              // icon: IconLock,
            },
            {
              title: "Forbidden",
              url: "/403",
              // icon: IconUserOff,
            },
            {
              title: "Not Found",
              url: "/404",
              // icon: IconError404,
            },
            {
              title: "Internal Server Error",
              url: "/500",
              // icon: IconServerOff,
            },
            {
              title: "Maintenance Error",
              url: "/503",
              // icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          url: "/settings",
        },
      ],
    },
  ],
};
