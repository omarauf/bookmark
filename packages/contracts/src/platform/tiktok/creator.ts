import z from "zod";

// const TiktokMetadataCreatorSchema = z.object({
//   username: z.string(),
//   verified: z.boolean().optional(),
//   name: z.string().optional(),
// });

// export const CreateTiktokCreatorSchema = z.object({
//   platform: z.literal("tiktok"),
//   kind: z.literal("profile"),
//   metadata: TiktokMetadataCreatorSchema,
// });

export const TiktokMetadataCreatorSchema = z.object({
  platform: z.literal("tiktok"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
});
