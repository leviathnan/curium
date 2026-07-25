import { MinusIcon, SquareIcon, XIcon, CopyIcon } from "@phosphor-icons/react";
import { useState, useCallback, useEffect } from "react";
import { TextReveal } from "./TextReveal";

function getAppWindow() {
  const tauriWindow = (window as any).__TAURI__?.window;
  return tauriWindow?.appWindow ?? tauriWindow?.getCurrentWindow?.();
}

export function useIsTauri() {
  const [tauri, setTauri] = useState(false);
  useEffect(() => { setTauri(!!getAppWindow()); }, []);
  return tauri;
}

function useIsMacOS() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(
      navigator.platform.includes("Mac") ||
      navigator.userAgent.includes("Macintosh"),
    );
  }, []);
  return isMac;
}

function MacTrafficLights() {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="titlebar-traffic-lights"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        className="traffic-light traffic-light-close"
        onClick={() => getAppWindow()?.close?.()}
        title="Close"
      >
        {hovering && <XIcon size={8} />}
      </button>
      <button
        className="traffic-light traffic-light-minimize"
        onClick={() => getAppWindow()?.minimize?.()}
        title="Minimize"
      >
        {hovering && <MinusIcon size={8} />}
      </button>
      <button
        className="traffic-light traffic-light-maximize"
        onClick={() => getAppWindow()?.toggleMaximize?.()}
        title="Maximize"
      >
        {hovering && <SquareIcon size={7} />}
      </button>
    </div>
  );
}

export function TitleBar() {
  const isMac = useIsMacOS();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const win = getAppWindow();
    if (!win) return;

    win.isMaximized?.().then(setIsMaximized).catch(() => {});

    const unlisten = win.listen?.("tauri://resize", async () => {
      try {
        const maximized = await win.isMaximized?.();
        setIsMaximized(!!maximized);
      } catch {}
    });

    return () => { unlisten?.then?.((fn: () => void) => fn()); };
  }, []);

  const minimize = useCallback(async () => {
    try { await getAppWindow()?.minimize?.(); } catch {}
  }, []);

  const toggleMaximize = useCallback(async () => {
    try { await getAppWindow()?.toggleMaximize?.(); } catch {}
  }, []);

  const close = useCallback(async () => {
    try { await getAppWindow()?.close?.(); } catch {}
  }, []);

  if (isMac) {
    return (
      <div data-tauri-drag-region className="titlebar titlebar-mac">
        <MacTrafficLights />
        <span className="titlebar-title"><TextReveal text="Curium" per="char" /></span>
        <span />
      </div>
    );
  }

  return (
    <div data-tauri-drag-region className="titlebar">
      <span className="titlebar-title"><TextReveal text="Curium" per="char" /></span>
      <div className="titlebar-controls">
        <button onClick={minimize} className="titlebar-btn" title="Minimize">
          <MinusIcon size={14} />
        </button>
        <button onClick={toggleMaximize} className="titlebar-btn" title={isMaximized ? "Restore" : "Maximize"}>
          {isMaximized ? <CopyIcon size={12} /> : <SquareIcon size={11} />}
        </button>
        <button onClick={close} className="titlebar-btn titlebar-btn-close" title="Close">
          <XIcon size={14} />
        </button>
      </div>
    </div>
  );
}
