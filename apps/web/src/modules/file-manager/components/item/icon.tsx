import { Archive, File, FileText, Folder, ImageIcon } from "lucide-react";
import type { FileItem } from "../../types";

type Props = {
  item: FileItem;
  size?: "small" | "large";
};

export function ItemIcon({ item, size = "large" }: Props) {
  const iconSize = size === "small" ? "h-4 w-4" : "h-8 w-8";

  if (item.type === "folder") {
    return <Folder className={`${iconSize} text-blue-500`} />;
  }

  const extension = item.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <ImageIcon className={`${iconSize} text-green-500`} />;
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return <FileText className={`${iconSize} text-red-500`} />;
    case "zip":
    case "rar":
    case "7z":
      return <Archive className={`${iconSize} text-orange-500`} />;
    default:
      return <File className={`${iconSize} text-gray-500`} />;
  }
}
