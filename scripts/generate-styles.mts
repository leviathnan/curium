import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  EYE_SHAPES,
  PUPIL_SHAPES,
  PIXEL_SHAPES,
  QR_COLORS,
} from "@curium/shared";

// ─── Curated lists (not exported from @curium/shared as labeled arrays) ──────

const QR_TYPES = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "WiFi" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "sms", label: "SMS" },
  { id: "contact", label: "Contact" },
  { id: "location", label: "Location" },
  { id: "event", label: "Event" },
  { id: "otpauth", label: "OTP Auth" },
];

const FRAME_STYLES = [
  { id: "none", label: "None" },
  { id: "thin", label: "Thin" },
  { id: "rounded", label: "Round" },
  { id: "thick", label: "Thick" },
  { id: "dashed", label: "Dash" },
  { id: "dotted", label: "Dot" },
  { id: "double", label: "Dbl" },
];

const CORNERS = [
  { id: 0, label: "Sharp" },
  { id: 8, label: "Slight" },
  { id: 16, label: "Soft" },
  { id: 24, label: "Round" },
  { id: 32, label: "Pill" },
];

// ─── Extras: appended if not already present by id ──────────────────────────

const EXTRA_EYES = [
  { id: "inpoint", label: "Inpoint" },
  { id: "outpoint", label: "Outpoint" },
  { id: "leaf", label: "Leaf" },
];

const EXTRA_PUPILS = [
  { id: "none", label: "None" },
  { id: "microchip", label: "Microchip" },
  { id: "hashtag", label: "Hashtag" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function mergeById<T extends { id: string | number }>(
  base: T[],
  extras: T[],
): T[] {
  const ids = new Set(base.map((item) => item.id));
  return [...base, ...extras.filter((item) => !ids.has(item.id))];
}

// ─── Build catalog ──────────────────────────────────────────────────────────

const catalog = {
  pixel: PIXEL_SHAPES,
  eye: mergeById(EYE_SHAPES, EXTRA_EYES),
  pupil: mergeById(PUPIL_SHAPES, EXTRA_PUPILS),
  type: QR_TYPES,
  frame: FRAME_STYLES,
  color: QR_COLORS,
  corners: CORNERS,
};

// ─── Write ──────────────────────────────────────────────────────────────────

const outPath = resolve(import.meta.dirname, "..", "styles.json");
writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n");

console.log(`✓ styles.json written (${Object.keys(catalog).length} categories)`);
