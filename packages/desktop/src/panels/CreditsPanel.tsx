import { ArrowSquareOutIcon } from "@phosphor-icons/react";

const LIBS = [
  {
    name: "React",
    url: "https://react.dev",
    role: "UI framework",
  },
  {
    name: "rsbuild",
    url: "https://rsbuild.dev",
    role: "Build tooling",
  },
  {
    name: "Tauri",
    url: "https://tauri.app",
    role: "Desktop runtime",
  },
  {
    name: "TypeScript",
    url: "https://typescriptlang.org",
    role: "Type safety",
  },
  {
    name: "GSAP",
    url: "https://greensock.com/gsap",
    role: "Animations",
  },
  {
    name: "Phosphor Icons",
    url: "https://phosphoricons.com",
    role: "Icon set",
  },
  {
    name: "fflate",
    url: "https://github.com/101arrowz/fflate",
    role: "ZIP compression",
  },
  {
    name: "qrcode",
    url: "https://github.com/soldair/node-qrcode",
    role: "QR generation",
  },
];

export function CreditsPanel() {
  return (
    <>
      <div className="section">
        <div className="section-title">Libraries</div>
        <div className="link-list">
          {LIBS.map((lib) => (
            <a
              key={lib.name}
              className="link-row"
              href={lib.url}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                {lib.name}
              </span>
              <ArrowSquareOutIcon size={14} />
            </a>
          ))}
        </div>
      </div>
      <div className="section" style={{ textAlign: "center", marginTop: 16 }}>
        <p style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: 0.5 }}>
          Built with open source, for open source
        </p>
      </div>
    </>
  );
}
