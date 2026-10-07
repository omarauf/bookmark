import type { Scrape } from "@workspace/contracts/scrape";
import { cn } from "cn";
import { fNumber, fSize } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";

type Props = {
  scrape: Scrape;
  className?: string;
};

export function ScrapeDetails({ scrape, className }: Props) {
  const counts = [
    { label: "Total items", value: scrape.validPost + scrape.invalidPost },
    { label: "Valid", value: scrape.validPost },
    { label: "Invalid", value: scrape.invalidPost },
  ];
  const details = [
    { label: "Scraped", value: fDateTime(scrape.scrapedAt) },
    {
      label: "Processed",
      value: scrape.processedAt ? fDateTime(scrape.processedAt) : "Not yet",
    },
    { label: "File size", value: fSize(scrape.size / 1024) },
  ];

  return (
    <div className={cn("flex shrink-0 flex-wrap items-center", className)}>
      <dl className="flex gap-8 sm:gap-10">
        {counts.map(({ label, value }) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="text-muted-foreground text-xs">{label}</dt>
            <dd className="font-medium text-3xl tabular-nums tracking-tight">{fNumber(value)}</dd>
          </div>
        ))}
      </dl>

      <dl className="grid gap-y-1 text-xs lg:ml-auto">
        {details.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-[5rem_1fr] gap-x-6">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
