import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export function Splash() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const htmlSplash = document.getElementById("curium-splash");
    const container = containerRef.current;
    const iconNode = iconRef.current;
    const textNode = textRef.current;

    if (!container || !iconNode || !textNode) return;

    htmlSplash?.remove();
    gsap.set([iconNode, textNode], { opacity: 0 });

    let tl: gsap.core.Timeline | null = null;

    tl = gsap
      .timeline()
      .fromTo(
        iconNode,
        { opacity: 0, scale: 0.5, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
      )
      .fromTo(
        textNode,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "<",
      )
      .to(container, {
        opacity: 0,
        scale: 0.96,
        duration: 0.45,
        ease: "power3.inOut",
        delay: 0.8,
        onComplete: () => container.remove(),
      });

    return () => {
      tl?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="splash">
      <img ref={iconRef} src="./icon.png" alt="Curium" className="splash-icon" />
      <div ref={textRef} className="splash-text">Curium</div>
    </div>
  );
}
