import z from "zod";
import { PlatformTypeSchema } from "./common/platform-type";
import { BasicSearchSchema } from "./table";

const ImportSchema = z.object({
  _id: z.string(),
  id: z.string(),
  name: z.string(),
  type: PlatformTypeSchema,
  size: z.number(),
  validPostCount: z.number(),
  invalidPostCount: z.number(),
  downloadedAt: z.boolean().optional(),
  importedAt: z.boolean().optional(),
  scrapedAt: z.date().optional(),
});

export const CreateImportSchema = z.object({ file: z.file() });

export const ListImportSchema = BasicSearchSchema.extend({
  type: PlatformTypeSchema.optional(),
});

export const DeleteImportSchema = ImportSchema.pick({ id: true });

export const RunImportSchema = z.object({ id: z.string(), download: z.boolean() });

export type Import = z.infer<typeof ImportSchema>;
