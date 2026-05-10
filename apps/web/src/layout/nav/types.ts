import type { LinkProps } from "@tanstack/react-router";

export type NavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  url?: LinkProps["to"] | (string & {});
  items?: NavItem[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};
