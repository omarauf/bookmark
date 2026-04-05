import z from "zod";

// const InstagramMetadataCreatorSchema = z.object({
//   username: z.string(),
//   verified: z.boolean().optional(),
//   name: z.string().optional(),
// });

// export const CreateInstagramCreatorSchema = z.object({
//   platform: z.literal("instagram"),
//   kind: z.literal("profile"),
//   metadata: InstagramMetadataCreatorSchema,
// });

export const InstagramMetadataCreatorSchema = z.object({
  platform: z.literal("instagram"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
});
