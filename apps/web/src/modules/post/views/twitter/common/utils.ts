import type { Profile } from "@workspace/contracts/views/profile";

export function isVerified(creator: Profile) {
  if (creator.kind === "profile") return creator.verified;

  return false;
}
