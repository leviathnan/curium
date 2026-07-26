import type { QRType, QRStyle } from "@curium/shared";
import {
  QrCodeIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
  StackIcon,
  BookmarkSimpleIcon,
  ClockCounterClockwiseIcon,
  GearSixIcon,
  InfoIcon,
  LifebuoyIcon,
  CpuIcon,
  HeartIcon,
} from "@phosphor-icons/react";

export interface FormState {
  url: { url: string };
  text: { text: string };
  email: { to: string; subject: string; body: string };
  phone: { phone: string };
  sms: { phone: string; message: string };
  wifi: {
    ssid: string;
    password: string;
    encryption: "WPA" | "WEP" | "nopass";
  };
  contact: { name: string; phone: string; email: string; org: string };
  location: { lat: string; lng: string; label: string };
  event: { title: string; location: string; start: string; end: string; description: string };
  otpauth: { issuer: string; account: string; secret: string; algorithm: "SHA1" | "SHA256" | "SHA512"; digits: 6 | 8; period: number };
}

export const DEFAULT_FORMS: FormState = {
  url: { url: "" },
  text: { text: "" },
  email: { to: "", subject: "", body: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  wifi: { ssid: "", password: "", encryption: "WPA" },
  contact: { name: "", phone: "", email: "", org: "" },
  location: { lat: "", lng: "", label: "" },
  event: { title: "", location: "", start: "", end: "", description: "" },
  otpauth: { issuer: "", account: "", secret: "", algorithm: "SHA1", digits: 6, period: 30 },
};

export interface Template {
  id: string;
  name: string;
  style: QRStyle;
}

export interface HistoryEntry {
  id: string;
  data: string;
  style: QRStyle;
  svg: string;
  createdAt: number;
}

export type TabId =
  | "generate"
  | "style"
  | "adjust"
  | "batch"
  | "templates"
  | "history"
  | "settings"
  | "about"
  | "info"
  | "support"
  | "credits";

export const QR_TYPES: { id: QRType; label: string }[] = [
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

export const TOP_TABS: { id: TabId; icon: typeof QrCodeIcon; label: string }[] = [
  { id: "generate", icon: QrCodeIcon, label: "Generate" },
  { id: "style", icon: PaletteIcon, label: "Style" },
  { id: "adjust", icon: SlidersHorizontalIcon, label: "Adjust" },
  { id: "batch", icon: StackIcon, label: "Batch" },
  { id: "templates", icon: BookmarkSimpleIcon, label: "Templates" },
  { id: "history", icon: ClockCounterClockwiseIcon, label: "History" },
];

export const BOTTOM_TABS: { id: TabId; icon: typeof ClockCounterClockwiseIcon; label: string }[] = [
  { id: "settings", icon: GearSixIcon, label: "Settings" },
  { id: "about", icon: InfoIcon, label: "About" },
  { id: "info", icon: CpuIcon, label: "Info" },
  { id: "support", icon: LifebuoyIcon, label: "Support" },
  { id: "credits", icon: HeartIcon, label: "Credits" },
];
