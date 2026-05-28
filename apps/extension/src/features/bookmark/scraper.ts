import { generateIngestFilename } from "@workspace/core/ingest";
import { client } from "@/api/rpc";

export const scrapeChromeBookmark = async () => {
  const bookmarkTreeNodes = await chrome.bookmarks.getTree();

  const jsonString = JSON.stringify(bookmarkTreeNodes);
  const fileName = generateIngestFilename("chrome");

  const file = new File([jsonString], fileName, { type: "application/json" });

  await client.ingest.create({ file });
};
