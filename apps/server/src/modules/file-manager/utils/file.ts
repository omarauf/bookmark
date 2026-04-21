import {
  FileExtensionEnum,
  MimeToFileTypeMap,
  MimeTypeEnum,
} from "@workspace/contracts/file-manager";

export function parseFileUpload(file: File) {
  const { name, size, type } = file;

  const mimeTypeResult = MimeTypeEnum.safeParse(type);
  if (!mimeTypeResult.success) return undefined;

  const extension = name.includes(".") ? name.split(".").pop()?.toLowerCase() : undefined;
  if (!extension) return undefined;

  const ext = FileExtensionEnum.safeParse(extension);
  if (!ext.success) return undefined;

  const fileType = MimeToFileTypeMap[mimeTypeResult.data] ?? undefined;
  if (!fileType) return undefined;

  return {
    name,
    size,
    mimeType: mimeTypeResult.data,
    extension: ext.data,
    type: fileType,
  };
}
