import { generateSVG as generateSharedSVG, type QRStyle } from "@curium/shared";

export function generateSVG(data: string, qrStyle: QRStyle, size = 512): string | null {
  // Mobile renders logos natively; SVG export keeps the existing logo-free output.
  return generateSharedSVG(data, qrStyle, size, true, true);
}
