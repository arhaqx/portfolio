"use client";

import { useRef } from "react";

import { gsap, useGSAP, NO_MOTION_PREF_QUERY } from "@/lib/gsap";

/** Thin page-scroll progress bar. Hidden entirely when reduced motion is on. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_MOTION_PREF_QUERY, () => {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: barRef },
  );

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 2,
        zIndex: 10,
        pointerEvents: "none",
        background: "var(--brand-solid-strong)",
        transformOrigin: "0 50%",
        transform: "scaleX(0)",
        willChange: "transform",
      }}
    />
  );
}
