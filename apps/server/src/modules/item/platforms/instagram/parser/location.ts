import type { InstagramLocation } from "@workspace/contracts/instagram";
import type { Location } from "@workspace/contracts/raw/instagram";

export function locationParser(location?: Location): InstagramLocation | undefined {
  if (!location) return undefined;

  return {
    address: location.address,
    name: location.name,
    lat: location.lat || 0,
    lng: location.lng || 0,
    city: location.city,
  };
}
