import z from "zod";

export const ParsedUserSchema = z.object({
  userId: z.string(),
  url: z.url(),
  username: z.string(),
  profilePicture: z.string().optional(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  verified: z.boolean(),
});

export type ParsedUser = z.infer<typeof ParsedUserSchema>;
