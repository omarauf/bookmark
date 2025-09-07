import { readFileSync } from "node:fs";
import {
  CreateLinkSchema,
  DeleteLinkSchema,
  ListLinkSchema,
  MoveLinkSchema,
  TreeLinkSchema,
} from "@workspace/contracts/link";
import z from "zod";
import { publicProcedure } from "@/lib/orpc";
import { LinkService } from "./service";

export const linkRouter = {
  tree: publicProcedure.input(TreeLinkSchema).handler(async ({ input }) => {
    return await LinkService.tree(input);
  }),

  list: publicProcedure.input(ListLinkSchema).handler(async ({ input }) => {
    return await LinkService.list(input);
  }),

  domains: publicProcedure.handler(async () => {
    return await LinkService.domains();
  }),

  folders: publicProcedure.handler(async () => {
    return await LinkService.folders();
  }),

  create: publicProcedure.input(CreateLinkSchema.array()).handler(async ({ input }) => {
    await LinkService.create(input);
    return;
  }),

  test: publicProcedure
    .route({ method: "GET", path: "/link/ping/{id}" })
    //
    .input(z.object({ id: z.string() }))
    .handler(({ input: { id } }) => `pong${id}`),

  preview: publicProcedure
    .route({ path: "/links/{id}/preview" })
    .input(z.object({ id: z.string() }))
    .errors({
      BAD_REQUEST: {
        message: "Failed to fetch link preview xx",
      },
      NOT_FOUND: {
        message: "Link not found xx",
      },
    })
    .handler(async ({ input: { id } }) => {
      return await LinkService.preview(id);
    }),

  favicon: publicProcedure
    .route({ path: "/link/{url}/favicon", method: "GET" })
    .input(z.object({ url: z.string() }))
    .handler(async ({ input: { url } }) => {
      const filePath = await LinkService.favicon(url);
      const img = readFileSync(filePath);
      return new File([img], "favicon.png", { type: "image/png" });
    }),

  move: publicProcedure.input(MoveLinkSchema).handler(async ({ input: { ids, path } }) => {
    return await LinkService.move(ids, path);
  }),

  delete: publicProcedure
    .route({ path: "/{id}/delete" })
    .input(DeleteLinkSchema)
    .handler(async ({ input: { ids, hard } }) => {
      await LinkService.delete(ids, hard);
    }),
};
