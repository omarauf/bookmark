import { z } from "zod";

export const ColorSchema = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color");
