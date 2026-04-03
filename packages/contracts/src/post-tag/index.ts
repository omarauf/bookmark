import z from "zod";

const TaggedCreatorSchema = z.object({
  creatorId: z.uuid(),
  postId: z.uuid(),
  x: z.number(),
  y: z.number(),
});

const CreateTaggedCreatorSchema = z.object({
  externalCreatorId: z.string(),
  externalPostId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const TaggedCreatorSchemas = {
  entity: TaggedCreatorSchema,
  create: CreateTaggedCreatorSchema,
};

export type CreateTaggedCreator = z.infer<typeof CreateTaggedCreatorSchema>;
