import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ShieldIcon, PaletteIcon, ScanIcon, ArrowRightIcon, HeartIcon } from "@phosphor-icons/react";
import icon from "../icon.png";
import { TextReveal } from "./TextReveal";

const FEATURES = [
  { icon: ShieldIcon, text: "Fully offline, zero tracking" },
  { icon: PaletteIcon, text: "Deep customization, logos, themes" },
  { icon: ScanIcon, text: "Scan, reskin, and re-export any QR" },
];

interface WelcomeProps {
  onDone: () => void;
}

export function Welcome({ onDone }: WelcomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(logoRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" })
      .fromTo(titleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.2")
      .fromTo(descRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.15")
      .fromTo(featuresRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.1")
      .fromTo(btnsRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");
  }, []);

  const handleDone = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.3,
      ease: "power3.in",
      onComplete: onDone,
    });
  };

  return (
    <div ref={rootRef} className="welcome-screen">
      <div className="welcome-content">
        <div ref={logoRef} className="welcome-logo-wrap">
          <img src={icon} alt="Curium" className="welcome-logo" />
        </div>

        <div ref={titleRef} className="welcome-title"><TextReveal text="Welcome to Curium" per="word" /></div>

        <div ref={descRef} className="welcome-desc">
          A privacy-first QR customizer.<br />
          No ads. No accounts. No network.<br />
          Your codes stay on your device.
        </div>

        <div ref={featuresRef} className="welcome-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="welcome-feature-row">
              <div className="welcome-feature-icon">
                <f.icon size={18} />
              </div>
              <span className="welcome-feature-text">{f.text}</span>
            </div>
          ))}
        </div>

        <div ref={btnsRef} className="welcome-btns">
          <button className="welcome-btn-primary" onClick={handleDone}>
            Get Started
            <ArrowRightIcon size={16} />
          </button>
          <button className="welcome-btn-secondary" onClick={handleDone}>
            <HeartIcon size={14} />
            Support the project
          </button>
        </div>
      </div>
    </div>
  );
}
