import { z } from "zod";
import { ItemBaseViewSchema } from "../../core/item/entity";
import { MovieMetadataSchema, TvMetadataSchema } from "../../platforms/imdb";

export const MovieSchema = ItemBaseViewSchema.extend({ ...MovieMetadataSchema.shape });

export const TvSchema = ItemBaseViewSchema.extend({ ...TvMetadataSchema.shape });

export const ImdbSchema = z.discriminatedUnion("kind", [MovieSchema, TvSchema]);
