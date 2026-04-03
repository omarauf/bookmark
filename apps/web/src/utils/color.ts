export function isLight(color?: string) {
  if (!color) {
    console.error("Please provide a color code to check.", color);
    return undefined;
  }

  const c = hexToRgb(color);
  if (!c) {
    console.error("Failed to convert color to RGB.", color);
    return undefined;
  }

  const { r, g, b } = c;

  // Calculate luminance using the formula: L = 0.299 * R + 0.587 * G + 0.114 * B
  const a = [r, g, b].map((v) => {
    const vNorm = v / 255;
    return vNorm <= 0.03928 ? vNorm / 12.92 : ((vNorm + 0.055) / 1.055) ** 2.4;
  });
  const luminance = (a[0] || 0) * 0.2126 + (a[1] || 0) * 0.7152 + (a[2] || 0) * 0.0722;

  // Check if luminance is above a threshold to determine if the color is light
  const threshold = 0.5; // You can adjust this threshold based on your preference
  return luminance > threshold ? 1 : 0;
}

export function hexToRgb(hex: string) {
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return { r: 0, g: 0, b: 0 };

  const hexValue = hex.replace("#", "");
  const bigint = Number.parseInt(hexValue, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
