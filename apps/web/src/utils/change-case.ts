// ----------------------------------------------------------------------

export function paramCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ----------------------------------------------------------------------

export function snakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// ----------------------------------------------------------------------

export function sentenceCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ----------------------------------------------------------------------

export function camelCaseTextToTitleCaseText(string: string) {
  const result = string.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
}

// ----------------------------------------------------------------------

export function snakeCaseToTitleCase(string: string) {
  return string
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ----------------------------------------------------------------------

export function toLowerCase(value: string) {
  return value.toLowerCase();
}

// ----------------------------------------------------------------------

export function toTitleCase(value: string) {
  return value.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

// ----------------------------------------------------------------------

export function camelCaseToPascalCase(camelCaseStr: string): string {
  if (!camelCaseStr) return "";
  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
}
