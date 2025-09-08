import { ORPCError } from "@orpc/server";
import {
  CreateImportSchema,
  DeleteImportSchema,
  ListImportSchema,
  RunImportSchema,
} from "@workspace/contracts/import";
import { publicProcedure } from "@/lib/orpc";
import { getDownloaderQueue, QUEUE } from "@/queue";
import { fileManager } from "../file-manager/service";
import { mapInstagram } from "../posts/instagram/mapper";
import { parseInstagram } from "../posts/instagram/parser";
import { ImportModel } from "./model";

export const importRouter = {
  create: publicProcedure
    .route({ path: "/import" })
    .input(CreateImportSchema)
    .handler(async ({ input }) => {
      const { scrapedAt, file, type } = input;

      const exist = await ImportModel.findOne({ name: file.name }).exec();

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = file.name.replace(".json", "");
      await fileManager.write(`json/${fileName}.json`, buffer);

      const data = buffer.toString("utf-8");

      const parsedData = parseInstagram(data);

      if (exist) {
        return await ImportModel.updateOne(
          { name: file.name },
          { $set: { type: input.type, scrapedAt: input.scrapedAt, size: file.size } },
        );
      }

      return await ImportModel.insertOne({
        name: file.name,
        validPostCount: parsedData.valid.length,
        invalidPostCount: parsedData.invalid.length,
        size: file.size,
        type: type,
        scrapedAt: scrapedAt,
      });
    }),

  list: publicProcedure.input(ListImportSchema).handler(async ({ input }) => {
    const { type } = input;
    const imports = await ImportModel.find({
      ...(type ? { type } : {}),
    });
    return imports;
  }),

  run: publicProcedure.input(RunImportSchema).handler(async ({ input: { id, download } }) => {
    const data = await ImportModel.findById(id).exec();
    if (!data) throw new ORPCError("NOT_FOUND", { message: "Import not found" });

    const filenameNoExtension = data.name.split(".").slice(0, -1).join(".");
    const fileContent = await fileManager.readFileAsString(`json/${filenameNoExtension}.json`);

    if (data.type === "instagram") {
      const parsedData = parseInstagram(fileContent);

      const { valid, invalid } = parsedData;
      const result = await mapInstagram(valid);

      if (download) {
        await ImportModel.updateOne({ _id: data._id }, { $set: { downloadedAt: new Date() } });

        const queue = getDownloaderQueue();

        await queue.add(QUEUE.downloader, { id: data.id });
      }

      await ImportModel.updateOne({ _id: data._id }, { $set: { importedAt: new Date() } });

      return {
        mappedUsers: result.mappedUsers,
        mappedPosts: result.mappedPosts,
        invalidPosts: invalid.length,
      };
    }

    throw new ORPCError("BAD_REQUEST", { message: "Unsupported import type" });
  }),

  delete: publicProcedure.input(DeleteImportSchema).handler(async ({ input: { id } }) => {
    const importData = await ImportModel.findById(id);
    if (!importData) throw new ORPCError("NOT_FOUND", { message: "Import not found" });
    await ImportModel.deleteOne({ _id: id });
  }),
};
