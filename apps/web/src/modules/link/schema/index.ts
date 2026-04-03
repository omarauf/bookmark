import { LinkSchemas } from "@workspace/contracts/link";
import z from "zod";

export const SearchLinkSchema = z.object({
  ...LinkSchemas.list.request.shape,
  ...LinkSchemas.tree.request.shape,
  view: z.enum(["grid", "list"]).default("grid").catch("grid"),
});

export type SearchLink = z.infer<typeof SearchLinkSchema>;
