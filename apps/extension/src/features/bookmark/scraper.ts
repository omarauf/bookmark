import { generateImportFilename } from "@workspace/core/import";
import { client } from "@/api/rpc";

export const scrapeChromeBookmark = async () => {
  const bookmarkTreeNodes = await chrome.bookmarks.getTree();

  const jsonString = JSON.stringify(bookmarkTreeNodes);
  const fileName = generateImportFilename("chrome");

  const file = new File([jsonString], fileName, { type: "application/json" });

  await client.import.create({ file });
};
