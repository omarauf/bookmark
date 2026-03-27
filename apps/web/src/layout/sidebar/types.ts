import type { NavGroup } from "../nav/types";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};
