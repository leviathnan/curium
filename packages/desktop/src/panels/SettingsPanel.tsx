import {
  QrCodeIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
  StackIcon,
  BookmarkSimpleIcon,
  ClockCounterClockwiseIcon,
  GearSixIcon,
  InfoIcon,
  CpuIcon,
  LifebuoyIcon,
  ShuffleIcon,
  DownloadSimpleIcon,
  FileImageIcon,
  CopyIcon,
  XIcon,
  MinusIcon,
  SquareIcon,
  CaretRightIcon,
  CaretDownIcon,
  CheckIcon,
  ArrowSquareOutIcon,
  HeartIcon,
  ShieldIcon,
  ScanIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";

const ICON_MEANINGS = [
  { icon: QrCodeIcon, name: "Generate", meaning: "Create QR codes" },
  { icon: PaletteIcon, name: "Style", meaning: "Colors, eyes, pixels" },
  { icon: SlidersHorizontalIcon, name: "Adjust", meaning: "Size, correction, gradient" },
  { icon: StackIcon, name: "Batch", meaning: "Bulk generation" },
  { icon: BookmarkSimpleIcon, name: "Templates", meaning: "Save style configs" },
  { icon: ClockCounterClockwiseIcon, name: "History", meaning: "Past QR codes" },
  { icon: ShuffleIcon, name: "Shuffle", meaning: "Randomize style" },
  { icon: DownloadSimpleIcon, name: "Export SVG", meaning: "Vector download" },
  { icon: FileImageIcon, name: "Export PNG", meaning: "Raster download" },
  { icon: CopyIcon, name: "Copy", meaning: "Clipboard action" },
  { icon: XIcon, name: "Close / Error", meaning: "Dismiss or problem" },
  { icon: CheckIcon, name: "Success", meaning: "Completed or correct" },
  { icon: MinusIcon, name: "Minimize", meaning: "Window minimize" },
  { icon: SquareIcon, name: "Maximize", meaning: "Window maximize" },
  { icon: CaretRightIcon, name: "Expand", meaning: "Collapsible section" },
  { icon: CaretDownIcon, name: "Dropdown", meaning: "Menu indicator" },
  { icon: ArrowSquareOutIcon, name: "External Link", meaning: "Opens in new tab" },
  { icon: GearSixIcon, name: "Settings", meaning: "App preferences" },
  { icon: InfoIcon, name: "About", meaning: "App philosophy" },
  { icon: CpuIcon, name: "Info", meaning: "Build details" },
  { icon: LifebuoyIcon, name: "Support", meaning: "Help the project" },
  { icon: HeartIcon, name: "Credits", meaning: "Libraries and tools" },
  { icon: ShieldIcon, name: "Privacy", meaning: "Offline, no tracking" },
  { icon: ScanIcon, name: "Scan", meaning: "Camera QR scanning" },
  { icon: ArrowRightIcon, name: "Proceed", meaning: "Continue action" },
];

export function SettingsPanel({
  theme,
  setTheme,
}: {
  theme: "dark" | "light" | "amoled" | "system";
  setTheme: (t: "dark" | "light" | "amoled" | "system") => void;
}) {
  return (
    <>
      <div className="section">
        <div className="section-title">Theme</div>
        <div className="btn-row">
          {(["system", "dark", "light", "amoled"] as const).map((t) => (
            <button
              key={t}
              className={`btn ${theme === t ? "btn-primary" : ""}`}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Keyboard Shortcuts</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <span>Shuffle style</span>
            <kbd
              style={{
                background: "var(--bg)",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              Space
            </kbd>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <span>Export SVG</span>
            <kbd
              style={{
                background: "var(--bg)",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              Ctrl+S
            </kbd>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <span>Export PNG</span>
            <kbd
              style={{
                background: "var(--bg)",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              Ctrl+Shift+S
            </kbd>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Icon Guide</div>
        <div style={{ fontSize: 12 }}>
          {ICON_MEANINGS.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "6px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <item.icon size={16} style={{ color: "var(--primary)", marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ color: "var(--text)", fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>{item.meaning}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
