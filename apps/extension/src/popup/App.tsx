import { Button } from "@workspace/ui/components/button";
import { scrapeChromeBookmark } from "@/scrapper/bookmark";

export default function App() {
  return (
    <div className="flex w-60 flex-col gap-8 bg-neutral-800 p-10">
      <Button variant="destructive" className="hover:cursor-pointer">
        Open Instagram
      </Button>
      <Button variant="destructive" className="hover:cursor-pointer" onClick={scrapeChromeBookmark}>
        Scrape Bookmark
      </Button>
    </div>
  );
}
