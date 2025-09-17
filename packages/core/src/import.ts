import { type PlatformType, PlatformTypeSchema } from "@workspace/contracts/platform-type";

export function generateImportFilename(type: PlatformType, date: Date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const formatDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  return `${type}_${formatDate}.json`;
}

export function parseImportFilename(filename: string) {
  const defaultResult = { date: undefined, type: undefined };
  const split = filename.split("_");
  if (split.length !== 3) return defaultResult;

  const type = split[0];
  const dateOnly = split[1];
  const timeOnly = split[2]?.replace(".json", "");

  const valid = PlatformTypeSchema.safeParse(type);
  if (!valid.success) return defaultResult;

  if (!type || !dateOnly || !timeOnly) return defaultResult;

  const datePart = `${dateOnly}_${timeOnly}`;

  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})$/;
  const match = datePart.match(dateRegex);
  if (!match) return defaultResult;

  const [, year, month, day, hours, minutes, seconds] = match;

  if (!year || !month || !day || !hours || !minutes || !seconds) return defaultResult;

  const date = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
    Number.parseInt(day, 10),
    Number.parseInt(hours, 10),
    Number.parseInt(minutes, 10),
    Number.parseInt(seconds, 10),
  );

  return { date, type: valid.data };
}
