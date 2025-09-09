import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useState } from "react";
import { scrapeChromeBookmark } from "./scraper";

export function Bookmark() {
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      await scrapeChromeBookmark();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="gap-0 rounded-none border-neutral-700 bg-neutral-800">
      <CardHeader>
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
          onClick={handleScrape}
          disabled={loading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Scraping..." : "Scrape Chrome Bookmarks"}
        </Button>
      </CardContent>
    </Card>
  );
}
