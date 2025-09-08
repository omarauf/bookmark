import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { useId, useState } from "react";
import { scrapeChromeBookmark } from "@/scrapper/bookmark";
import type { CommunicationMessage, CommunicationResponse } from "@/types/communication";

export default function App() {
  const pagesId = useId();
  const downloadId = useId();
  const sendId = useId();

  const [instagramConfig, setInstagramConfig] = useState({
    pages: 1,
    download: false,
    send: true,
  });

  const [isLoading, setIsLoading] = useState({
    instagram: false,
    bookmark: false,
  });

  const handleInstagramScrape = async () => {
    setIsLoading((prev) => ({ ...prev, instagram: true }));
    try {
      await chrome.runtime.sendMessage<CommunicationMessage, CommunicationResponse>({
        type: "scrape",
        platform: "instagram",
        count: instagramConfig.pages,
        download: instagramConfig.download,
        send: instagramConfig.send,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, instagram: false }));
    }
  };

  const handleInstagramCleaner = async () => {
    setIsLoading((prev) => ({ ...prev, instagram: true }));
    try {
      await chrome.runtime.sendMessage<CommunicationMessage, CommunicationResponse>({
        type: "unsave",
        platform: "instagram",
        count: instagramConfig.pages,
        download: instagramConfig.download,
        send: instagramConfig.send,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, instagram: false }));
    }
  };

  const handleBookmarkScrape = async () => {
    setIsLoading((prev) => ({ ...prev, bookmark: true }));
    try {
      await scrapeChromeBookmark();
    } finally {
      setIsLoading((prev) => ({ ...prev, bookmark: false }));
    }
  };

  return (
    <div className="w-md bg-neutral-900 text-white">
      {/* Instagram Scraper Section */}
      <Card className="gap-0 rounded-none border-neutral-700 bg-neutral-800">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <div className="h-2 w-2 rounded-full bg-pink-500" />
            Instagram Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={downloadId} className="text-neutral-300 text-sm">
              Download Content
            </Label>
            <Switch
              id={downloadId}
              checked={instagramConfig.download}
              onCheckedChange={(checked) =>
                setInstagramConfig((prev) => ({ ...prev, download: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={sendId} className="text-neutral-300 text-sm">
              Send to Server
            </Label>
            <Switch
              id={sendId}
              checked={instagramConfig.send}
              onCheckedChange={(checked) =>
                setInstagramConfig((prev) => ({ ...prev, send: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={pagesId} className="text-neutral-300 text-sm">
              Number of Pages
            </Label>
            <Input
              id={pagesId}
              type="number"
              min="1"
              max="50"
              value={instagramConfig.pages}
              onChange={(e) =>
                setInstagramConfig((prev) => ({
                  ...prev,
                  pages: Math.max(1, Number(e.target.value)),
                }))
              }
              className="h-7 w-1/3 border-neutral-600 bg-neutral-700 text-white"
              placeholder="Enter pages to scrape"
            />
          </div>

          <div className="flex w-full gap-2">
            <Button
              onClick={handleInstagramScrape}
              disabled={isLoading.instagram}
              className="w-1/2 bg-pink-600 text-white hover:bg-pink-700"
            >
              {isLoading.instagram ? "Scraping..." : "Start Instagram Scrape"}
            </Button>
            <Button
              onClick={handleInstagramCleaner}
              disabled={isLoading.instagram}
              className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading.instagram ? "Cleaning..." : "Start Instagram Cleaner"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookmark Scraper Section */}
      <Card className="gap-0 rounded-none border-neutral-700 bg-neutral-800">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Bookmark Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-400 text-sm">
            Extract and import all your Chrome bookmarks to the server.
          </p>

          <Button
            onClick={handleBookmarkScrape}
            disabled={isLoading.bookmark}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading.bookmark ? "Scraping..." : "Scrape Chrome Bookmarks"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
