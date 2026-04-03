import type { InstagramLocation } from "@/contracts/platform/instagram";
import type { Location } from "@/contracts/raw/instagram";

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
