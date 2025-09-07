import type { LinkProps } from "@tanstack/react-router";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: string;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: string;
}

export type NavLink = BaseNavItem & {
  url: LinkProps["to"];
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps["to"] })[];
  url?: never;
};

export type NavItem = NavCollapsible | NavLink;

export interface NavGroupItem {
  title: string;
  items: NavItem[];
}

export interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroupItem[];
}
