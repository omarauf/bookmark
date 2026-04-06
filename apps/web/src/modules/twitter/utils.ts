import type { Profile } from "@workspace/contracts/profile";

export function isVerified(creator: Profile) {
  if (creator.metadata.kind === "profile") return creator.metadata.verified;

  return false;
}
