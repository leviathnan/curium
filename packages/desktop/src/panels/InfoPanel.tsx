import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import buildInfo from "../build-info.json";
import pkg from "../../package.json";

export function InfoPanel() {
  const isTauri = typeof window !== "undefined" && !!(window as any).__TAURI__;

  return (
    <>
      <div className="section">
        <div className="section-title">Build</div>
        <div className="info-grid">
          <div className="info-row">
            <span className="info-label">Version</span>
            <span className="info-value">{pkg.version}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Platform</span>
            <span className="info-value">
              {isTauri ? "Desktop (Tauri)" : "Desktop (Web)"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Runtime</span>
            <span className="info-value">
              {isTauri ? "React + Tauri" : "React + rsbuild"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Renderer</span>
            <span className="info-value">
              {isTauri
                ? navigator.userAgent.includes("Edg")
                  ? "WebView2"
                  : "WebKitGTK"
                : "Browser"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Commit</span>
            <span className="info-value">
              {buildInfo.shortCommit}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Branch</span>
            <span className="info-value">{buildInfo.branch}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Built</span>
            <span className="info-value">
              {buildInfo.buildDate.split("T")[0]}
            </span>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Links</div>
        <div className="link-list">
          <a
            className="link-row"
            href="https://github.com/nylxar/curium"
            target="_blank"
            rel="noreferrer"
          >
            <span>Source Code</span>
            <ArrowSquareOutIcon size={14} />
          </a>
          <a
            className="link-row"
            href="https://github.com/nylxar/curium/issues"
            target="_blank"
            rel="noreferrer"
          >
            <span>Report an Issue</span>
            <ArrowSquareOutIcon size={14} />
          </a>
          <a
            className="link-row"
            href="https://github.com/nylxar/curium/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            <span>License</span>
            <ArrowSquareOutIcon size={14} />
          </a>
          <a
            className="link-row"
            href="https://curium.design/download"
            target="_blank"
            rel="noreferrer"
          >
            <span>Other Downloads</span>
            <ArrowSquareOutIcon size={14} />
          </a>
          <a
            className="link-row"
            href="https://x.com/nylxar"
            target="_blank"
            rel="noreferrer"
          >
            <span>Follow Nylxar</span>
            <ArrowSquareOutIcon size={14} />
          </a>
          <a
            className="link-row"
            href="https://curium.design"
            target="_blank"
            rel="noreferrer"
          >
            <span>Visit Website</span>
            <ArrowSquareOutIcon size={14} />
          </a>
        </div>
      </div>
      <div className="section" style={{ textAlign: "center", marginTop: 24 }}>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-faint)",
            letterSpacing: 0.5,
          }}
        >
          Made with cats · Open source
        </p>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-faint)",
            letterSpacing: 0.5,
            marginTop: 4,
          }}
        >
          &copy; {new Date().getFullYear()} Curium
        </p>
      </div>
    </>
  );
}
