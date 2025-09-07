import { ListLinkSchema, TreeLinkSchema } from "@workspace/contracts/link";
import z from "zod";

export const SearchLinkSchema = z.object({
  ...TreeLinkSchema.shape,
  ...ListLinkSchema.shape,
  view: z.enum(["grid", "list"]).default("grid").catch("grid"),
});

export type SearchLink = z.infer<typeof SearchLinkSchema>;
