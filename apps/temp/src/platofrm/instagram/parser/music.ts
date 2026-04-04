import type { InstagramMusic } from "@/contracts/platform/instagram";
import type { ClipsMetadata } from "@/contracts/raw/instagram";

export function musicParser(clip?: ClipsMetadata): InstagramMusic | undefined {
  if (!clip) return undefined;

  if (clip.original_sound_info) return { original: true };

  if (clip.music_info)
    return {
      original: false,
      artist: clip.music_info.music_asset_info.display_artist,
      title: clip.music_info.music_asset_info.title,
    };

  return undefined;
}
[];
