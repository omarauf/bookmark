import { ORPCError } from "@orpc/server";
import z from "zod";
import { publicProcedure } from "@/lib/orpc";
import { fileManager } from "./service";

export const fileManagerRoute = {
  get: publicProcedure
    .route({
      path: "/files/{postType}/{type}/{filename}/{ext}",
      method: "GET",
      inputStructure: "detailed",
    })
    .input(
      z.object({
        params: z.object({
          postType: z.enum(["instagram"]),
          type: z.enum(["image", "video", "user", "carousel"]),
          filename: z.string(),
          ext: z.enum(["jpg", "mp4"]),
        }),
        query: z.object({
          placeholder: z
            .enum(["true", "false"])
            .optional()
            .transform((value) => value === "true"),
        }),
      }),
    )
    .handler(async ({ input: { params, query } }) => {
      const { ext, filename, postType, type } = params;
      const { placeholder } = query;
      try {
        const buf = placeholder
          ? await fileManager.readFile(`${postType}/placeholder/${filename}.${ext}`)
          : await fileManager.readFile(`${postType}/${type}/${filename}.${ext}`);
        return new File([new Uint8Array(buf)], `${filename}.${ext}`, {
          type: ext === "jpg" ? "image/jpeg" : "video/mp4",
        });
      } catch (error) {
        console.error(error);
        throw new ORPCError("NOT_FOUND", { message: "file not found" });
      }
    }),
};
