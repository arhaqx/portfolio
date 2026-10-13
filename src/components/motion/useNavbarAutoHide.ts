"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

import { gsap, EASE, DURATION, DESKTOP_QUERY, NO_MOTION_PREF_QUERY } from "@/lib/gsap";

/** Scrolling less than this (px) from the top always keeps the navbar visible. */
const ALWAYS_VISIBLE_UNTIL = 80;
/** Must have scrolled past this (px) before the navbar is allowed to hide. */
const HIDE_AFTER = 160;

/**
 * Hide elements marked `data-nav-autohide` when scrolling down, show when scrolling up.
 *
 * Desktop/tablet only: on mobile the header is the page's only navigation (a
 * bottom bar), so it stays visible. Animates `transform` only.
 */
export function useNavbarAutoHide(lenis: Lenis | null) {
  useEffect(() => {
    if (!lenis) return;

    const mm = gsap.matchMedia();

    mm.add(`${DESKTOP_QUERY} and ${NO_MOTION_PREF_QUERY}`, () => {
      let hidden = false;

      const setHidden = (next: boolean) => {
        if (hidden === next) return;
        hidden = next;
        gsap.to("[data-nav-autohide]", {
          yPercent: next ? -130 : 0,
          duration: DURATION.fast,
          ease: EASE,
          overwrite: "auto",
        });
      };

      const onScroll = (instance: Lenis) => {
        const y = instance.scroll;

        if (y < ALWAYS_VISIBLE_UNTIL) return setHidden(false);

        // Don't hide the nav out from under a keyboard user.
        const header = document.querySelector("header[data-nav-autohide]");
        if (header?.matches(":focus-within")) return setHidden(false);

        if (instance.direction === 1 && y > HIDE_AFTER) setHidden(true);
        else if (instance.direction === -1) setHidden(false);
      };

      const unsubscribe = lenis.on("scroll", onScroll);

      return () => {
        unsubscribe();
        gsap.set("[data-nav-autohide]", { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [lenis]);
}
