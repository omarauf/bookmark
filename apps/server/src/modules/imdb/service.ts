import type { MovieMetadata, TvMetadata } from "@workspace/contracts/imdb";
import type { ImdbDetails } from "./integrations/omdb/type";

export function imdbToItem(imdbData: ImdbDetails): MovieMetadata | TvMetadata {
  const genres = imdbData.Genre.split(",").map((g) => g.trim());
  const directors = imdbData.Director.split(",").map((d) => d.trim());
  const writers = imdbData.Writer.split(",").map((w) => w.trim());
  const actors = imdbData.Actors.split(",").map((a) => a.trim());

  const votes = Number.parseInt(imdbData.imdbVotes.replace(/,/g, ""), 10) || 0;
  const rating = Number.parseFloat(imdbData.imdbRating);
  const boxOffice = imdbData.BoxOffice
    ? Number.parseInt(imdbData.BoxOffice.replace(/[$,]/g, ""), 10)
    : 0;

  const runtime = Number.parseInt(imdbData.Runtime.replace(" min", ""), 10) || 0;
  const year = Number.parseInt(imdbData.Year, 10) || 0;

  if (imdbData.Type === "movie") {
    return {
      platform: "imdb",
      rated: imdbData.Rated,
      runtime: runtime,
      kind: "movie",
      plot: imdbData.Plot,
      directors: directors,
      writers: writers,
      actors: actors,
      year: year,
      released: imdbData.Released,
      genre: genres,
      poster: imdbData.Poster,
      rating: rating,
      votes: votes,
      boxOffice: boxOffice,
    };
  }

  if (imdbData.Type === "series") {
    return {
      platform: "imdb",
      kind: "tv",
      plot: imdbData.Plot,
      directors: directors,
      writers: writers,
      actors: actors,
      year: year,
      released: imdbData.Released,
      genre: genres,
      poster: imdbData.Poster,
      rating: rating,
      votes: votes,
      runtime: runtime,
      seasons: Number.parseInt(imdbData.totalSeasons, 10) || 0,
    };
  }

  throw new Error(`Unsupported IMDb type: ${imdbData.Type}`);
}
