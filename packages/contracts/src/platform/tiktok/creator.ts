import z from "zod";
import { BaseCreatorSchema, CreateBaseCreatorSchema } from "../base/creator";

export const TiktokCreatorSchema = BaseCreatorSchema.extend({
  platform: z.literal("tiktok"),
});

export const CreateTiktokCreatorSchema = CreateBaseCreatorSchema.extend({
  platform: z.literal("tiktok"),
});

export const TiktokMetadataCreatorSchema = z.object({
  platform: z.literal("tiktok"),
});
