import z from "zod";
import { ObjectIdSchema } from "./common/object-id-schema";
import { PlatformTypeSchema } from "./common/platform-type";
import { BasicSearchSchema } from "./table";

const ImportEntitySchema = z.object({
  _id: ObjectIdSchema,
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

export const ImportSchema = ImportEntitySchema.extend({ _id: z.string() });

export const CreateImportSchema = z.object({
  file: z.file(),
  type: PlatformTypeSchema,
  date: z.date(),
});

export const ListImportSchema = BasicSearchSchema.extend({
  type: PlatformTypeSchema.optional(),
});

export const DeleteImportSchema = ImportSchema.pick({ id: true });

export const RunImportSchema = z.object({ id: z.string(), download: z.boolean() });

export type Import = z.infer<typeof ImportSchema>;
