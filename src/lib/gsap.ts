"use client";

/**
 * Central GSAP setup.
 *
 * Every component must import gsap / ScrollTrigger / SplitText / useGSAP from
 * here (never from "gsap" directly) so plugins are registered exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

  // Mobile browsers resize the viewport when the URL bar shows/hides while
  // scrolling. Without this, ScrollTrigger would refresh (and jump) each time.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared motion tokens so every animation on the site feels consistent. */
export const EASE = "power3.out";
export const DURATION = {
  fast: 0.6,
  base: 0.8,
  slow: 1,
} as const;

/** Breakpoint above which heavy effects (parallax) are enabled. */
export const DESKTOP_QUERY = "(min-width: 769px)";
export const NO_MOTION_PREF_QUERY = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
