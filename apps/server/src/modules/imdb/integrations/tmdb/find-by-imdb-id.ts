import { env } from "@/config/env";

export async function getByImdbId(
  id: string,
): Promise<[Response, undefined] | [undefined, string]> {
  const url = new URL(`https://api.themoviedb.org/3/find/${id}`);
  url.searchParams.set("external_source", "imdb_id");

  const omdbRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.TMDB_API_KEY}`,
    },
  });

  if (!omdbRes.ok) {
    return [undefined, "Failed to fetch movie data"];
  }

  const result = await omdbRes.json();

  return [result as Response, undefined];
}

type Response = {
  movie_results: Array<{
    adult: boolean;
    backdrop_path: string;
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    original_language: string;
    genre_ids: Array<number>;
    popularity: number;
    release_date: string;
    softcore: boolean;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }>;
  person_results: Array<{
    adult: boolean;
    id: number;
    name: string;
    original_name: string;
    media_type: string;
    popularity: number;
    gender: number;
    known_for_department: string;
    profile_path: string;
    known_for: Array<{
      adult: boolean;
      backdrop_path: string;
      id: number;
      name?: string;
      original_name?: string;
      overview: string;
      poster_path: string;
      media_type: string;
      original_language: string;
      genre_ids: Array<number>;
      popularity: number;
      first_air_date?: string;
      softcore: boolean;
      vote_average: number;
      vote_count: number;
      origin_country?: Array<string>;
      title?: string;
      original_title?: string;
      release_date?: string;
      video?: boolean;
    }>;
  }>;
  tv_results: Array<{
    adult: boolean;
    backdrop_path: string;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    original_language: string;
    genre_ids: Array<number>;
    popularity: number;
    first_air_date: string;
    softcore: boolean;
    vote_average: number;
    vote_count: number;
    origin_country: Array<string>;
  }>;
  tv_episode_results: Array<{
    id: number;
    name: string;
    overview: string;
    media_type: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  }>;
  //   tv_season_results: Array<any>;
};
