import { type Platform, PlatformEnum } from "@workspace/contracts/platform";

export function generateImportFilename(platform: Platform, date: Date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const formatDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  return `${platform}_${formatDate}.json`;
}

export function parseImportFilename(filename: string) {
  const defaultResult = { scrapedAt: undefined, platform: undefined };
  const split = filename.split("_");
  if (split.length !== 3) return defaultResult;

  const platform = split[0];
  const dateOnly = split[1];
  const timeOnly = split[2]?.replace(".json", "");

  const valid = PlatformEnum.safeParse(platform);
  if (!valid.success) return defaultResult;

  if (!platform || !dateOnly || !timeOnly) return defaultResult;

  const datePart = `${dateOnly}_${timeOnly}`;

  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})$/;
  const match = datePart.match(dateRegex);
  if (!match) return defaultResult;

  const [, year, month, day, hours, minutes, seconds] = match;

  if (!year || !month || !day || !hours || !minutes || !seconds) return defaultResult;

  const scrapedAt = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
    Number.parseInt(day, 10),
    Number.parseInt(hours, 10),
    Number.parseInt(minutes, 10),
    Number.parseInt(seconds, 10),
  );

  return { scrapedAt, platform: valid.data };
}
