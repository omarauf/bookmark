import type { Tags } from "@workspace/contracts/instagram/raw";
import type { InstagramUserTag } from "@workspace/contracts/instagram/user-tag";
import { userParser } from "./user";

export function userTagParser(usertags?: Tags): InstagramUserTag[] {
  if (!usertags) return [];

  return (
    usertags?.in.map((t) => {
      if (!t.user) throw new Error("No user found in usertags");
      if (!t.position) throw new Error("No position found in usertags");

      return {
        user: userParser(t.user),
        x: t.position[0],
        y: t.position[1],
      };
    }) || []
  );
}
