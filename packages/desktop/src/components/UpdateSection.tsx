import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import {
  ArrowCircleUpIcon,
  CheckIcon,
  SpinnerIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import pkg from "../../package.json";

type UpdateStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "up-to-date" }
  | { state: "available"; version: string; body: string }
  | { state: "downloading" }
  | { state: "ready"; version: string }
  | { state: "error"; message: string };

const isTauri = typeof window !== "undefined" && !!(window as any).__TAURI__;
const isLinux =
  typeof navigator !== "undefined" && navigator.userAgent.includes("Linux");

async function checkLinuxUpdate(): Promise<{
  version: string;
  body: string;
} | null> {
  const resp = await fetch(
    "https://api.github.com/repos/nylxar/curium/releases/latest",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
    },
  );
  if (!resp.ok) {
    throw new Error(`Update check failed (${resp.status})`);
  }
  const data = await resp.json();
  const latest = data.tag_name?.replace(/^v/, "");
  if (!latest || !isNewerVersion(latest, pkg.version)) return null;
  return { version: latest, body: data.body ?? "" };
}

function isNewerVersion(candidate: string, current: string): boolean {
  const parse = (version: string) =>
    version
      .split("-", 1)[0]
      .split(".")
      .map((part) => Number.parseInt(part, 10));
  const next = parse(candidate);
  const installed = parse(current);

  if (
    next.length !== 3 ||
    installed.length !== 3 ||
    next.some((part) => !Number.isInteger(part) || part < 0) ||
    installed.some((part) => !Number.isInteger(part) || part < 0)
  ) {
    return false;
  }

  for (let index = 0; index < 3; index += 1) {
    if (next[index] !== installed[index]) {
      return next[index] > installed[index];
    }
  }
  return false;
}

export function UpdateSection() {
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });

  const checkForUpdates = useCallback(async () => {
    setStatus({ state: "checking" });
    try {
      if (isLinux) {
        const result = await checkLinuxUpdate();
        if (result) {
          setStatus({
            state: "available",
            version: result.version,
            body: result.body,
          });
        } else {
          setStatus({ state: "up-to-date" });
        }
      } else {
        const update = await check();
        if (update) {
          setStatus({
            state: "available",
            version: update.version,
            body: update.body ?? "",
          });
        } else {
          setStatus({ state: "up-to-date" });
        }
      }
    } catch (e) {
      setStatus({
        state: "error",
        message: e instanceof Error ? e.message : "Update check failed",
      });
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    if (status.state !== "available") return;
    setStatus({ state: "downloading" });
    try {
      if (isLinux) {
        await invoke("run_updater");
        setStatus({ state: "ready", version: status.version });
      } else {
        const update = await check();
        if (update) {
          await update.downloadAndInstall();
          setStatus({ state: "ready", version: update.version });
        } else {
          setStatus({ state: "up-to-date" });
        }
      }
    } catch (e) {
      setStatus({
        state: "error",
        message: e instanceof Error ? e.message : "Update failed",
      });
    }
  }, [status]);

  const handleRelaunch = useCallback(() => {
    relaunch();
  }, []);

  if (!isTauri) return null;

  return (
    <div className="section">
      <div className="section-title">Update</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
        Current version: {pkg.version}
      </div>

      {status.state === "idle" && (
        <button className="btn btn-primary" onClick={checkForUpdates} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ArrowCircleUpIcon size={14} />
          Check for Updates
        </button>
      )}

      {status.state === "checking" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
          <SpinnerIcon size={14} className="spin" />
          Checking...
        </div>
      )}

      {status.state === "up-to-date" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <CheckIcon size={14} style={{ color: "var(--primary)" }} />
          <span style={{ color: "var(--text)" }}>Up to date</span>
          <button
            className="btn"
            onClick={checkForUpdates}
            style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px" }}
          >
            Check again
          </button>
        </div>
      )}

      {status.state === "available" && (
        <div>
          <div style={{ fontSize: 12, color: "var(--text)", marginBottom: 4 }}>
            Version {status.version} is available
          </div>
          {status.body && (
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8, lineHeight: 1.5 }}>
              {status.body}
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={downloadAndInstall}
            style={{ width: "100%" }}
          >
            {isLinux ? "Install Update" : "Download & Install"}
          </button>
        </div>
      )}

      {status.state === "downloading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
          <SpinnerIcon size={14} className="spin" />
          {isLinux ? "Installing..." : "Downloading..."}
        </div>
      )}

      {status.state === "ready" && (
        <div>
          <div style={{ fontSize: 12, color: "var(--text)", marginBottom: 8 }}>
            Version {status.version} ready to install
          </div>
          <button
            className="btn btn-primary"
            onClick={handleRelaunch}
            style={{ width: "100%" }}
          >
            Restart Now
          </button>
        </div>
      )}

      {status.state === "error" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 8 }}>
            <WarningCircleIcon size={14} style={{ color: "#ef4444" }} />
            <span style={{ color: "#ef4444" }}>{status.message}</span>
          </div>
          <button className="btn" onClick={checkForUpdates} style={{ width: "100%" }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
