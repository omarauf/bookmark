import { generateScrapeFilename } from "@workspace/core/scrape";
import { client } from "@/api/rpc";

export const scrapeChromeBookmark = async () => {
  const bookmarkTreeNodes = await chrome.bookmarks.getTree();

  const jsonString = JSON.stringify(bookmarkTreeNodes);
  const fileName = generateScrapeFilename("chrome");

  const file = new File([jsonString], fileName, { type: "application/json" });

  await client.scrape.create({ file });
};
