import { env } from "@/config/env";
import { instagramCleaner } from "@/features/instagram/cleaner";
import { instagramScraper } from "@/features/instagram/scraper";
import { twitterScraper } from "@/features/twitter/scraper";
import type { CommunicationMessage, CommunicationResponse } from "@/types/communication";

chrome.runtime.onMessage.addListener(
  async (
    message: CommunicationMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: CommunicationResponse) => void,
  ): Promise<void> => {
    console.log("Message received:", message, sender);
    const { count, download, send, type, platform } = message;

    const url =
      platform === "instagram"
        ? `https://www.instagram.com/${env.VITE_INSTAGRAM_USERNAME}/saved/`
        : "https://x.com/home";

    try {
      const newTab = await chrome.tabs.create({ url });

      if (!newTab.id) return;

      const listener = (tabId: number, info: chrome.tabs.OnUpdatedInfo) => {
        if (tabId === newTab.id && info.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          if (platform === "twitter") {
            if (type === "unsave") {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                func: instagramCleaner,
                args: [
                  {
                    username: env.VITE_INSTAGRAM_USERNAME,
                    posts: count || 1,
                  },
                ],
                world: "MAIN",
                injectImmediately: true,
              });
            } else {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                func: twitterScraper,
                args: [
                  {
                    pages: count || 1,
                    download: download || false,
                    send: send || false,
                  },
                ],
                world: "MAIN",
                injectImmediately: true,
              });
            }
          }

          if (platform === "instagram") {
            if (type === "unsave") {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                func: instagramCleaner,
                args: [
                  {
                    username: env.VITE_INSTAGRAM_USERNAME,
                    posts: count || 1,
                  },
                ],
                world: "MAIN",
                injectImmediately: true,
              });
            }

            //
            else {
              chrome.scripting.executeScript({
                target: { tabId: newTab.id },
                func: instagramScraper,
                args: [
                  {
                    username: env.VITE_INSTAGRAM_USERNAME,
                    pages: count || 1,
                    download: download || false,
                    send: send || false,
                  },
                ],
                world: "MAIN",
                injectImmediately: true,
              });
            }
          }
        }
      };

      chrome.tabs.onUpdated.addListener(listener);

      sendResponse({ status: "success", data: { message: "Scraping started successfully" } });
    } catch (error) {
      console.error(error);
      sendResponse({
        status: "error",
        error: (error as Error).message || "An error occurred while starting the scrape",
      });
    }
  },
);
