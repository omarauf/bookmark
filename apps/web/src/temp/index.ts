import { links } from "./data";

console.clear();

function countCharacter(char: string, word: string): number {
  return word.split(char).length - 1;
}

function trimAfterXCharacter(str: string, x: number, char: string): string {
  const parts = str.split(char);
  if (parts.length <= x) return str;
  return parts.slice(0, x).join(char);
}

function getAll(parent = "/") {
  const level = parent === "/" ? 1 : parent ? parent.split("/").length : 0;

  const selectedLinks = links.filter((l) => l.path.startsWith(parent));

  const results = new Map<string, string>();
  selectedLinks
    .map((l) => l.path)
    .filter((link) => link.startsWith(parent))
    .filter((link) => countCharacter("/", link) >= level)
    .map((l) => trimAfterXCharacter(l, level + 1, "/"))
    .forEach((f) => {
      results.set(f, f.replace(parent, ""));
    });

  const folders = [...results].map(([path, folder]) => ({ path, folder }));
  const folderLinks = links.filter((link) => link.path === parent);

  return { folders, links: folderLinks };
}

const paths = ["/", "/Favorites bar", "/Other favorites", "/Mobile favorites"];

const parent = paths[2];

const folders = getAll(parent);
console.log("Folders:", folders);
