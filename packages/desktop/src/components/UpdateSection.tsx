import { useState, useCallback } from "react";
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

export function UpdateSection() {
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });

  const checkForUpdates = useCallback(async () => {
    setStatus({ state: "checking" });
    try {
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
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        setStatus({ state: "ready", version: update.version });
      } else {
        setStatus({ state: "up-to-date" });
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
            Download & Install
          </button>
        </div>
      )}

      {status.state === "downloading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
          <SpinnerIcon size={14} className="spin" />
          Downloading...
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
