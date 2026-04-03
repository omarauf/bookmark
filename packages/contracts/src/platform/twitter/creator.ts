import z from "zod";
import { BaseCreatorSchema, CreateBaseCreatorSchema } from "../base/creator";

export const TwitterCreatorSchema = BaseCreatorSchema.extend({
  platform: z.literal("twitter"),
});

export const CreateTwitterCreatorSchema = CreateBaseCreatorSchema.extend({
  platform: z.literal("twitter"),
  location: z.string().optional(),
});

export const TwitterMetadataCreatorSchema = z.object({
  platform: z.literal("twitter"),
  location: z.string().optional(),
});
