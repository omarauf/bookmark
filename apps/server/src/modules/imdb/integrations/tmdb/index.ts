import { getByImdbId } from "./find-by-imdb-id";
import { getMovieDetails } from "./movie-details";
import { getTVDetails } from "./tv-details";

export const tmdbClient = {
  getByImdbId,
  getMovieDetails,
  getTVDetails,
};
