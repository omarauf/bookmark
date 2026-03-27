import z from "zod";
import { BaseCreatorSchema, CreateBaseCreatorSchema } from "../base/creator";

export const InstagramCreatorSchema = BaseCreatorSchema.extend({
  platform: z.literal("instagram"),
});

export const CreateInstagramCreatorSchema = CreateBaseCreatorSchema.extend({
  platform: z.literal("instagram"),
});

export const InstagramMetadataCreatorSchema = z.object({
  platform: z.literal("instagram"),
});
