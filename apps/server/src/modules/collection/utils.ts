import { resolveLtreeLabel, slugify } from "@workspace/core/slugify";

export function getSlugPath(name: string, slug = "") {
  const selectedSlug = slug.trim().length > 0 ? slug : name;
  const slugValue = slugify(selectedSlug, { lower: true })
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(".", "");
  const pathLabel = resolveLtreeLabel(selectedSlug);
  return { slug: slugValue, path: pathLabel };
}
