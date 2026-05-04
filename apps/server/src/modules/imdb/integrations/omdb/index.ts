import { env } from "@/config/env";
import { isImdbId } from "../../utils";
import type { ImdbDetails } from "./type";

const OMDB_KEY = env.OMDB_API_KEY;

async function getByImdbId(
  imdbId: string,
): Promise<[ImdbDetails, undefined] | [undefined, string]> {
  if (!isImdbId(imdbId)) {
    return [undefined, "Invalid IMDb ID"];
  }

  const omdbRes = await fetch(`http://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${OMDB_KEY}`);

  if (!omdbRes.ok) {
    return [undefined, "Failed to fetch movie data"];
  }

  const result = await omdbRes.json();

  if (result.Response === "False") {
    return [undefined, "Movie not found"];
  }

  return [result as ImdbDetails, undefined];
}

async function getByTitle(
  title: string,
  options?: { type?: "movie" | "series" | "episode"; y?: string },
): Promise<[ImdbDetails, undefined] | [undefined, string]> {
  const url = new URL("http://www.omdbapi.com/");
  url.searchParams.set("t", title);
  url.searchParams.set("plot", "full");
  url.searchParams.set("apikey", OMDB_KEY);

  if (options?.type) {
    url.searchParams.set("type", options.type);
  }

  if (options?.y) {
    url.searchParams.set("y", options.y);
  }

  const omdbRes = await fetch(url);

  if (!omdbRes.ok) {
    return [undefined, "Failed to fetch movie data"];
  }

  const result = await omdbRes.json();

  if (result.Response === "False") {
    return [undefined, "Movie not found"];
  }

  return [result as ImdbDetails, undefined];
}

export const omdbClient = {
  getByImdbId,
  getByTitle,
};
