import z from "zod";

export const RelationEnum = z.enum(["created_by", "mentions", "related", "tagged", "quoted"]);
export type Relation = z.infer<typeof RelationEnum>;
export const RelationValues = RelationEnum.options as [Relation, ...Relation[]];
