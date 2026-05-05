import type { Profile } from "@workspace/contracts/views/profile";

export function isVerified(creator: Profile) {
  if (creator.metadata.kind === "profile") return creator.metadata.verified;

  return false;
}
