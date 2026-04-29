import type { MovieMetadata, TvMetadata } from "@workspace/contracts/imdb";
import { type CreateItem, ItemSchemas } from "@workspace/contracts/item";
import { db } from "@/core/db";
import { randomDelay } from "@/utils/delay";
import { items } from "../item/schema";
import { omdbClient } from "./integrations/omdb";
import type { ImdbDetails } from "./integrations/omdb/type";

export async function importFromLink() {
  const linkItems = await db.query.items.findMany({
    where: (item, { eq }) => eq(item.platform, "chrome"),
  });

  const imdbLinksItems = linkItems.filter((i) => i.url?.includes("imdb.com/title/"));

  const imdbIds = imdbLinksItems
    .map((i) => i.url?.match(/imdb\.com\/title\/(tt\d+)/)?.[1])
    .filter((id): id is string => !!id);

  if (!imdbIds.length) {
    console.log("No IMDb links found.");
    return;
  }

  // 🔹 Get already existing IMDb items in ONE query
  const existingItems = await db.query.items.findMany({
    where: (item, { and, inArray, eq }) =>
      and(eq(item.platform, "imdb"), inArray(item.externalId, imdbIds)),
    columns: {
      externalId: true,
    },
  });

  const existingIds = new Set(existingItems.map((i) => i.externalId));

  const invalidIds: string[] = [];
  const imdbItems: CreateItem[] = [];

  console.log("IMDb IDs found: ", imdbIds.length);

  let count = 1;
  for (const imdbId of imdbIds) {
    // 🔹 Skip if already exists
    if (existingIds.has(imdbId)) continue;

    console.log(`[IMDb] ${count++}/${imdbIds.length}`, `Processing IMDb ID: ${imdbId}`);
    const [data, error] = await omdbClient.getByImdbId(imdbId);

    if (error || !data) {
      invalidIds.push(imdbId);
      continue;
    }

    const metadata = imdbToItem(data);

    const newItem = {
      platform: "imdb",
      externalId: imdbId,
      url: `https://www.imdb.com/title/${imdbId}/`,
      caption: data.Title,
      kind: metadata.kind,
      metadata,
    };

    const result = ItemSchemas.create.safeParse(newItem);

    if (!result.success) {
      invalidIds.push(imdbId);
      continue;
    }

    imdbItems.push(result.data);

    await randomDelay(500, 1500);
  }

  console.log("Valid IMDb items: ", imdbItems.length);
  console.log("Invalid IMDb IDs: ", invalidIds);

  if (imdbItems.length > 0) {
    await db.insert(items).values(imdbItems);
  }
}

function imdbToItem(imdbData: ImdbDetails): MovieMetadata | TvMetadata {
  const genres = imdbData.Genre.split(",").map((g) => g.trim());
  const directors = imdbData.Director.split(",").map((d) => d.trim());
  const writers = imdbData.Writer.split(",").map((w) => w.trim());
  const actors = imdbData.Actors.split(",").map((a) => a.trim());

  const votes = parseInt(imdbData.imdbVotes.replace(/,/g, ""), 10) || 0;
  const rating = parseFloat(imdbData.imdbRating);
  const boxOffice = imdbData.BoxOffice ? parseInt(imdbData.BoxOffice.replace(/[$,]/g, ""), 10) : 0;

  const runtime = parseInt(imdbData.Runtime.replace(" min", ""), 10) || 0;

  const year = parseInt(imdbData.Year, 10) || 0;

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
      seasons: parseInt(imdbData.totalSeasons, 10) || 0,
    };
  }

  throw new Error(`Unsupported IMDb type: ${imdbData.Type}`);
}
