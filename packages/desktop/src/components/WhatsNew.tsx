import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import {
  SparkleIcon,
  HeartIcon,
  TrendUpIcon,
  InfoIcon,
  WarningCircleIcon,
  ShieldCheckIcon,
  LightningIcon,
  PlusCircleIcon,
  ListIcon,
  XIcon,
  ArrowsLeftRightIcon,
  WarningIcon,
  MinusCircleIcon,
} from "@phosphor-icons/react";
import { RELEASE_NOTES_MD } from "../constants/release-notes";
import { parseReleaseNotes, type ReleaseSection } from "../utils/release-notes-parser";

const ICON_MAP: Record<string, typeof SparkleIcon> = {
  sparkles: SparkleIcon,
  heart: HeartIcon,
  "trending-up": TrendUpIcon,
  info: InfoIcon,
  "alert-circle": WarningCircleIcon,
  "shield-check": ShieldCheckIcon,
  "shield-checkmark": ShieldCheckIcon,
  zap: LightningIcon,
  "plus-circle": PlusCircleIcon,
  "swap-horizontal": ArrowsLeftRightIcon,
  "alert-triangle": WarningIcon,
  "minus-circle": MinusCircleIcon,
  list: ListIcon,
};

function SectionIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] || ListIcon;
  return <Icon size={14} />;
}

interface WhatsNewProps {
  onDone: () => void;
}

export function WhatsNew({ onDone }: WhatsNewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const release = useMemo(() => parseReleaseNotes(RELEASE_NOTES_MD), []);

  useEffect(() => {
    const items = rootRef.current?.querySelectorAll(".whatsnew-item");
    if (!items?.length) return;
    gsap.fromTo(
      Array.from(items),
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.25, stagger: 0.03, ease: "power2.out", delay: 0.2 },
    );
  }, []);

  const handleDone = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onDone,
    });
  };

  return (
    <div ref={rootRef} className="whatsnew-screen">
      <div className="whatsnew-header">
        <span />
        <span className="whatsnew-title">What's New</span>
        <button className="whatsnew-done" onClick={handleDone}>
          <XIcon size={16} />
        </button>
      </div>
      <div className="whatsnew-body">
        <div className="whatsnew-version">
          <span className="whatsnew-version-badge">v{release.version}</span>
          {release.channel && (
            <span className="whatsnew-channel-badge">{release.channel}</span>
          )}
        </div>
        {release.sections.map((section, si) => (
          <div key={si}>
            {(si === 0 || release.sections[si - 1].group !== section.group) && (
              <div className="whatsnew-group-title">{section.group}</div>
            )}
            <div className="whatsnew-section">
              <div className="whatsnew-section-header">
                <div className="whatsnew-section-icon">
                  <SectionIcon name={section.icon} />
                </div>
                <span className="whatsnew-section-title">{section.title}</span>
              </div>
              {section.items.map((item, ii) => (
                <div key={ii} className="whatsnew-item">
                  <div className="whatsnew-dot" />
                  <span className="whatsnew-item-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
