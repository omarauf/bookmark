import { z } from "zod";

export const InstagramLocationSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  city: z.string(),
  address: z.string(),
});

export type InstagramLocation = z.infer<typeof InstagramLocationSchema>;
