import type { AnimeMetadata } from "@workspace/contracts/anime";
import type { MalAnimeDetails } from "./integrations/mal/type";

export function malToItem(malData: MalAnimeDetails): AnimeMetadata {
  const genres = malData.genres?.map((g) => g.name) ?? [];
  const studios =
    malData.studios?.map((s) => s.name).filter((name): name is string => Boolean(name)) ?? [];

  return {
    platform: "mal",
    kind: "anime",
    synopsis: malData.synopsis ?? "",
    poster: malData.main_picture?.large ?? malData.main_picture?.medium ?? "",
    rating: malData.mean ?? undefined,
    rank: malData.rank ?? undefined,
    popularity: malData.popularity ?? undefined,
    numEpisodes: malData.num_episodes ?? undefined,
    genres,
    studios,
    source: malData.source ?? undefined,
    status: malData.status ?? undefined,
    mediaType: malData.media_type ?? undefined,
    startDate: malData.start_date ?? undefined,
    endDate: malData.end_date ?? undefined,
    startSeasonYear: malData.start_season?.year ?? undefined,
    startSeason: malData.start_season?.season ?? undefined,
    broadcastDay: malData.broadcast?.day_of_the_week ?? undefined,
    broadcastTime: malData.broadcast?.start_time ?? undefined,
    averageEpisodeDuration: malData.average_episode_duration ?? undefined,
    ratingLabel: malData.rating ?? undefined,
    numListUsers: malData.num_list_users ?? undefined,
    numScoringUsers: malData.num_scoring_users ?? undefined,
    nsfw: malData.nsfw ?? undefined,
    background: malData.background ?? undefined,
  };
}
