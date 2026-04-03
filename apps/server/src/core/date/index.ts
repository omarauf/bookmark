import { env } from "@/config/env";

/**
 * Convert date string + timezone to a UTC Date object
 * Ignores the local environment timezone
 * @param {string} dateStr - date in YYYY-MM-DD format
 * @param {string|number|undefined} tz - timezone offset like "+3", "-5", "+03:00", "-05:30"
 * @returns {Date} UTC Date object
 */
export function parseDateWithFlexibleTZ(dateStr: string, tz?: string | number): Date {
  const timezone = tz ?? env.CLIENT_TIMEZONE;

  // Validate date string YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  let totalOffsetMinutes: number;

  if (typeof timezone === "number") {
    totalOffsetMinutes = timezone * 60;
  } else if (/^[+-]?\d{1,2}$/.test(timezone)) {
    const sign = timezone[0] === "-" ? -1 : 1;
    const hours = parseInt(timezone.replace(/[+-]/, ""), 10);
    totalOffsetMinutes = sign * hours * 60;
  } else if (/^[+-]\d{1,2}:\d{2}$/.test(timezone)) {
    const sign = timezone[0] === "-" ? -1 : 1;
    const [hourStr, minStr] = timezone.slice(1).split(":");
    totalOffsetMinutes = sign * (parseInt(hourStr, 10) * 60 + parseInt(minStr, 10));
  } else {
    throw new Error("Invalid timezone format. Examples: +3, -2, +03:00, -05:30");
  }

  // Parse as UTC by manually constructing Date.UTC
  const [year, month, day] = dateStr.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day, 0, 0, 0);

  // Shift by timezone offset to get true UTC
  const utcTimestamp = utcMidnight - totalOffsetMinutes * 60 * 1000;

  return new Date(utcTimestamp);
}
