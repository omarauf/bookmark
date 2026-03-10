import { parseInstagram } from "../instagram/parser";
import { parseTiktok } from "../tiktok/parser";
import { parseTwitter } from "../twitter/parser";

export const parsers = {
  instagram: parseInstagram,
  twitter: parseTwitter,
  tiktok: parseTiktok,
};
