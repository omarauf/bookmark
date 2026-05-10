import type { Profile } from "@workspace/contracts/views/profile";

export function isVerified(_creator: Profile) {
  // TODO: implement this properly when we have verified profiles in Twitter
  // if (creator.kind === "profile") return creator.verified;

  return false;
}
