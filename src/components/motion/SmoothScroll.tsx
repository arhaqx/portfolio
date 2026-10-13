"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { gsap, ScrollTrigger, NO_MOTION_PREF_QUERY } from "@/lib/gsap";
import { useNavbarAutoHide } from "./useNavbarAutoHide";

type ScrollTarget = HTMLElement | number;

interface ScrollApi {
  /** The Lenis instance, or null when smooth scroll is disabled (reduced motion / SSR). */
  lenis: Lenis | null;
  /** Scroll to an element or absolute Y position. Uses Lenis when active, native otherwise. */
  scrollTo: (target: ScrollTarget, offset?: number) => void;
  /** Scroll back to the top of the page. */
  scrollToTop: (immediate?: boolean) => void;
}

/** Native fallback so callers work the same with or without Lenis. */
function nativeScrollTo(target: ScrollTarget, offset = 0, immediate = false) {
  const top =
    typeof target === "number"
      ? target + offset
      : target.getBoundingClientRect().top + window.scrollY + offset;
  const reduced = !window.matchMedia(NO_MOTION_PREF_QUERY).matches;
  window.scrollTo({ top, behavior: immediate || reduced ? "auto" : "smooth" });
}

const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  scrollTo: (target, offset) => {
    if (typeof window !== "undefined") nativeScrollTo(target, offset);
  },
  scrollToTop: (immediate) => {
    if (typeof window !== "undefined") nativeScrollTo(0, 0, immediate);
  },
});

/** Access smooth-scroll helpers (anchor links, "back to top", etc.). */
export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Mounts Lenis smooth scrolling and keeps it in sync with GSAP / ScrollTrigger.
 *
 * Renders NO DOM of its own (it sits between <html> and <body>, where an extra
 * element would be invalid HTML), it only provides context.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ── Lenis lifecycle ────────────────────────────────────────────────────────
  useEffect(() => {
    const motionQuery = window.matchMedia(NO_MOTION_PREF_QUERY);
    let teardown: (() => void) | null = null;

    const init = () => {
      const instance = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        // We drive Lenis from GSAP's ticker below. Never also enable autoRaf,
        // or two rAF loops would fight each other.
        autoRaf: false,
      });

      // 1) Every Lenis scroll tick tells ScrollTrigger to re-evaluate.
      const unsubscribe = instance.on("scroll", ScrollTrigger.update);

      // 2) Lenis is advanced by GSAP's ticker (time is in seconds, Lenis wants ms).
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);

      // 3) Disable lag smoothing so GSAP doesn't "catch up" after a slow frame,
      //    which would desync it from Lenis' own timing.
      gsap.ticker.lagSmoothing(0);

      // Modals / the mobile chat lock scrolling via `body { overflow: hidden }`.
      // Lenis scrolls the window programmatically, which ignores that, so we
      // pause Lenis whenever the body is locked.
      const syncLock = () => {
        if (document.body.style.overflow === "hidden") instance.stop();
        else instance.start();
      };
      const lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      syncLock();

      lenisRef.current = instance;
      setLenis(instance);

      teardown = () => {
        lockObserver.disconnect();
        unsubscribe();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33); // GSAP defaults
        instance.destroy();
        lenisRef.current = null;
        setLenis(null);
      };
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      teardown?.();
      teardown = null;
      if (event.matches) init();
    };

    // prefers-reduced-motion: reduce → keep native scrolling entirely.
    if (motionQuery.matches) init();
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      teardown?.();
    };
  }, []);

  // ── Route changes: reset scroll position ───────────────────────────────────
  // NOTE: we deliberately do NOT refresh ScrollTrigger here. RouteGuard unmounts
  // the page and shows a spinner on every navigation, so the new content does not
  // exist yet. <PageAnimations> refreshes once the new page has mounted.
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  // ── Keep ScrollTrigger positions correct as the page changes size ──────────
  useEffect(() => {
    let timer: number | undefined;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    document.fonts?.ready.then(refresh);
    if (document.readyState !== "complete") window.addEventListener("load", refresh);

    // Fires when images load, content mounts/filters change, fonts swap, etc.
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
      observer.disconnect();
    };
  }, []);

  useNavbarAutoHide(lenis);

  const scrollTo = useCallback((target: ScrollTarget, offset = 0) => {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset });
    else nativeScrollTo(target, offset);
  }, []);

  const scrollToTop = useCallback((immediate = false) => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate });
    else nativeScrollTo(0, 0, immediate);
  }, []);

  const value = useMemo<ScrollApi>(
    () => ({ lenis, scrollTo, scrollToTop }),
    [lenis, scrollTo, scrollToTop],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
