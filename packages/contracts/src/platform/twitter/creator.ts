import z from "zod";

// const TwitterMetadataCreatorSchema = z.object({
//   username: z.string(),
//   verified: z.boolean().optional(),
//   name: z.string().optional(),
//   location: z.string().optional(),
// });

// export const CreateTwitterCreatorSchema = z.object({
//   platform: z.literal("twitter"),
//   kind: z.literal("profile"),
//   metadata: TwitterMetadataCreatorSchema,
// });

export const TwitterMetadataCreatorSchema = z.object({
  platform: z.literal("twitter"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
});
