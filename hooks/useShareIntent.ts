import { useEffect, useRef, useState, useCallback } from "react";
import * as Linking from "expo-linking";

export interface SharedContent {
  type: "text" | "url" | "image";
  value: string;
}

interface ShareIntentResult {
  shared: SharedContent | null;
  clear: () => void;
}

interface ShareIntentNative {
  consumePendingContent(): Promise<{ type: string; value: string } | null>;
  addListener(event: string, callback: (...args: any[]) => void): { remove(): void };
}

let nativeModule: ShareIntentNative | null = null;
try {
  nativeModule = require("share-intent").default;
} catch {}

export function useShareIntent(): ShareIntentResult {
  const [shared, setShared] = useState<SharedContent | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    if (nativeModule) {
      nativeModule.consumePendingContent().then((content) => {
        if (content && !handled.current) {
          handled.current = true;
          setShared({
            type: content.type as SharedContent["type"],
            value: content.value,
          });
        }
      }).catch(() => {});
    }

    const eventSub = nativeModule?.addListener(
      "onSharedContent",
      (content: { type: string; value: string }) => {
        if (!handled.current) {
          handled.current = true;
          setShared({
            type: content.type as SharedContent["type"],
            value: content.value,
          });
        }
      },
    );

    Linking.getInitialURL().then((url) => {
      if (!url || handled.current) return;
      const content = parseSharedUrl(url);
      if (content) {
        handled.current = true;
        setShared(content);
      }
    });

    const linkSub = Linking.addEventListener("url", ({ url }) => {
      if (handled.current) return;
      const content = parseSharedUrl(url);
      if (content) {
        handled.current = true;
        setShared(content);
      }
    });

    return () => {
      eventSub?.remove();
      linkSub.remove();
    };
  }, []);

  const clear = useCallback(() => {
    handled.current = false;
    setShared(null);
  }, []);

  return { shared, clear };
}

function parseSharedUrl(url: string): SharedContent | null {
  try {
    const parsed = new URL(url);

    if (parsed.protocol === "curium:" && parsed.pathname === "/share") {
      const text = parsed.searchParams.get("text");
      const sharedUrl = parsed.searchParams.get("url");
      if (text) return { type: "text", value: decodeURIComponent(text) };
      if (sharedUrl)
        return { type: "url", value: decodeURIComponent(sharedUrl) };
    }

    if (url.startsWith("intent://")) {
      const textMatch = url.match(/S\.android\.intent\.extra\.TEXT=([^;]+)/);
      if (textMatch) {
        return { type: "text", value: decodeURIComponent(textMatch[1]) };
      }
      const schemeMatch = url.match(/scheme=([^;]+)/);
      if (schemeMatch) {
        const inner = schemeMatch[1];
        if (/^https?:\/\//.test(inner)) return { type: "url", value: inner };
      }
    }

    if (/^https?:\/\//.test(url)) {
      return { type: "url", value: url };
    }
  } catch {
    if (url.length > 0 && url.length < 4096) {
      return { type: "text", value: url };
    }
  }

  return null;
}
