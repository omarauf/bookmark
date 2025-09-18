import { parseInstagram } from "../instagram/parser";
import { parseTwitter } from "../twitter/parser";

export const parsers = {
  instagram: parseInstagram,
  twitter: parseTwitter,
};
