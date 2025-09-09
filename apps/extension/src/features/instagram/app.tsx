import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { useId, useState } from "react";
import type { CommunicationMessage, CommunicationResponse } from "@/types/communication";

export function Instagram() {
  const pagesId = useId();
  const downloadId = useId();
  const sendId = useId();

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    pages: 1,
    download: false,
    send: true,
  });

  const handleScrape = async () => {
    setLoading(true);
    try {
      await chrome.runtime.sendMessage<CommunicationMessage, CommunicationResponse>({
        type: "scrape",
        platform: "instagram",
        count: config.pages,
        download: config.download,
        send: config.send,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCleaner = async () => {
    setLoading(true);
    try {
      await chrome.runtime.sendMessage<CommunicationMessage, CommunicationResponse>({
        type: "unsave",
        platform: "instagram",
        count: config.pages,
        download: config.download,
        send: config.send,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="gap-0 rounded-none border-neutral-700 bg-neutral-800">
      <CardHeader>
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
            checked={config.download}
            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, download: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor={sendId} className="text-neutral-300 text-sm">
            Send to Server
          </Label>
          <Switch
            id={sendId}
            checked={config.send}
            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, send: checked }))}
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
            value={config.pages}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, pages: Math.max(1, Number(e.target.value)) }))
            }
            className="h-7 w-1/3 border-neutral-600 bg-neutral-700 text-white"
            placeholder="Enter pages to scrape"
          />
        </div>
        <div className="flex w-full gap-2">
          <Button
            onClick={handleScrape}
            disabled={loading}
            className="w-1/2 bg-pink-600 text-white hover:bg-pink-700"
          >
            {loading ? "Scraping..." : "Start Instagram Scrape"}
          </Button>
          <Button
            onClick={handleCleaner}
            disabled={loading}
            className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Cleaning..." : "Start Instagram Cleaner"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
