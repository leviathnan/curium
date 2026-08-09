const ICON_MAP: Record<string, string> = {
  "what's new": "sparkles",
  "new": "sparkles",
  "features": "sparkles",
  "highlights": "sparkles",
  "fixes": "heart",
  "fix": "heart",
  "bug fixes": "heart",
  "improvements": "trending-up",
  "improvement": "trending-up",
  "changes": "swap-horizontal",
  "change": "swap-horizontal",
  "notes": "info",
  "note": "info",
  "breaking": "alert-circle",
  "security": "shield-checkmark",
  "performance": "zap",
  "removed": "minus-circle",
  "deprecated": "alert-triangle",
  "known limitations": "alert-triangle",
  "added": "plus-circle",
};

export interface ReleaseSection {
  title: string;
  icon: string;
  items: string[];
  group: string;
}

export interface ParsedRelease {
  version: string;
  channel: string;
  sections: ReleaseSection[];
}

export function parseReleaseNotes(markdown: string): ParsedRelease {
  const lines = markdown.split("\n");
  let version = "";
  let channel = "";
  const sections: ReleaseSection[] = [];
  let current: ReleaseSection | null = null;
  let group = "";

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h1 = line.match(/^#\s+Release Notes\s*[—–-]\s*v([\d.]+)\s*(?:\((\w+)\))?/i);
    if (h1) {
      version = h1[1];
      channel = h1[2] ?? "";
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)/);
    if (heading) {
      if (current?.items.length) sections.push(current);
      const title = heading[2].trim();
      const level = heading[1].length;
      const headingVersion = title.match(/\bv([\d.]+)/i);
      const headingChannel = title.match(/\(([^)]+)\)/)?.[1];
      if (!version && headingVersion) version = headingVersion[1];
      if (!channel && headingChannel) channel = headingChannel;
      if (level === 2) {
        group = title;
        current = null;
        continue;
      }
      const key = title.toLowerCase();
      const icon = ICON_MAP[key] ?? "list";
      current = { title, icon, items: [], group };
      continue;
    }
    const bullet = line.match(/^-\s+(.+)/);
    if (bullet && current) {
      current.items.push(bullet[1].trim());
    }
  }
  if (current?.items.length) sections.push(current);
  return { version, channel, sections };
}
