import { z } from "zod";

export const dateOnly = () =>
  z.string().transform((date, ctx) => {
    // Check format first (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      ctx.addIssue({
        format: "date",
        code: "invalid_format",
        message: "Date must be in YYYY-MM-DD format",
      });
      return z.NEVER;
    }

    // Parse manually to avoid JS Date quirks
    const [year, month, day] = date.split("-").map(Number);

    if (year === undefined || month === undefined || day === undefined) {
      ctx.addIssue({
        format: "date",
        code: "invalid_format",
        message: "Date must be in YYYY-MM-DD format",
      });
      return z.NEVER;
    }

    const parsed = new Date(year, month - 1, day);

    // Validate that the date components match (strict check)
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      ctx.addIssue({
        format: "date",
        code: "invalid_format",
        message: "Date must be in YYYY-MM-DD format",
      });
      return z.NEVER;
    }

    // return parsed;
    return date;
  });
