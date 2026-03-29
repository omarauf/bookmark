import type { NavGroup } from "../nav/types";

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export type SidebarData = {
  teams: Team[];
  navGroups: NavGroup[];
};
