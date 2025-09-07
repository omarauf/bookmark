import type { SidebarData } from "../layouts/sidebar/types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: "lucide:command",
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: "lucide:gallery-vertical-end",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "lucide:audio-waveform",
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
          icon: "lucide:link",
        },
        {
          title: "Instagram",
          url: "/instagram",
          icon: "mdi:instagram",
        },
        {
          title: "Collections",
          url: "/collections",
          icon: "material-symbols:collections-bookmark-rounded",
        },
        {
          title: "Tags",
          url: "/tags",
          icon: "material-symbols:tag",
        },
        {
          title: "Imports",
          url: "/imports",
          icon: "si:json-duotone",
        },
        {
          title: "Users",
          url: "/users",
          icon: "mdi:users",
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
