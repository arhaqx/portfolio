"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE,
  DURATION,
  DESKTOP_QUERY,
  NO_MOTION_PREF_QUERY,
} from "@/lib/gsap";

/**
 * Declarative scroll animations. Add a data attribute to any element inside a page,
 * no GSAP code required:
 *
 *   data-hero-item            Staggered load-in on page load (DOM order). Combine with
 *                             data-split on a heading for a text reveal in the sequence.
 *   data-reveal               Fade + rise when it enters the viewport (plays once).
 *                             Optional: data-reveal-delay="0.2" (seconds).
 *   data-stagger              On a container: its direct children animate in with a
 *                             stagger as they enter the viewport (plays once).
 *   data-split="lines|words"  SplitText heading reveal (plays once, reverts on cleanup).
 *   data-parallax="10"        Subtle scrub parallax, ± that many px. Desktop only.
 *
 * Everything is skipped when the user prefers reduced motion, so content is simply
 * visible. Parallax is skipped on small screens. Only transform and opacity animate.
 *
 * This component is mounted INSIDE <RouteGuard>, which remounts its children on every
 * navigation. So effects are created after the new page's DOM exists and are reverted
 * automatically (useGSAP) when leaving the page.
 */

/** When an element's top crosses this point of the viewport, it reveals. */
const REVEAL_START = "top 85%";

const scrollTriggerOnce = (trigger: Element): ScrollTrigger.Vars => ({
  trigger,
  start: REVEAL_START,
  once: true,
});

/**
 * Reveal a heading line-by-line / word-by-word. SplitText is reverted by GSAP when the
 * surrounding context reverts, which keeps the DOM clean for React and for screen readers
 * (SplitText sets aria-label on the element and hides the split pieces).
 */
function splitReveal(el: HTMLElement, options: { delay?: number; onScroll: boolean }) {
  const mode = el.dataset.split === "words" ? "words" : "lines";
  let played = false;

  SplitText.create(el, {
    type: mode,
    // Re-splits on resize and when web fonts finish loading, so lines stay correct.
    autoSplit: true,
    onSplit(self) {
      // After the reveal has played once, a resize-triggered re-split must NOT replay it.
      if (played) return;

      // Returning the tween lets SplitText revert + re-sync it across re-splits.
      return gsap.from(mode === "lines" ? self.lines : self.words, {
        opacity: 0,
        yPercent: 40,
        duration: DURATION.slow,
        ease: EASE,
        stagger: mode === "lines" ? 0.12 : 0.05,
        delay: options.delay ?? 0,
        scrollTrigger: options.onScroll ? scrollTriggerOnce(el) : undefined,
        onComplete: () => {
          played = true;
        },
      });
    },
  });
}

export function PageAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, scope);
      const mm = gsap.matchMedia();

      // ── Core effects (any screen size, only when motion is allowed) ──────────
      mm.add(NO_MOTION_PREF_QUERY, () => {
        // 1. Hero intro: staggered load-in, in DOM order.
        all("[data-hero-item]").forEach((el, index) => {
          const delay = 0.1 + index * 0.12;
          const splitTarget = el.dataset.split
            ? el
            : (el.querySelector("[data-split]") as HTMLElement | null);

          if (splitTarget) {
            splitReveal(splitTarget, { delay, onScroll: false });
          } else {
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: DURATION.slow,
              ease: EASE,
              delay,
            });
          }
        });

        // 2. Heading text reveal (hero headings are handled above).
        all("[data-split]")
          .filter((el) => !el.closest("[data-hero-item]"))
          .forEach((el) => splitReveal(el, { onScroll: true }));

        // 3. Section reveal: fade + slight rise, once.
        all("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: DURATION.base,
            ease: EASE,
            delay: Number.parseFloat(el.dataset.revealDelay ?? "0") || 0,
            scrollTrigger: scrollTriggerOnce(el),
          });
        });

        // 4. Staggered groups (cards, list items). Batched so items that enter the
        //    viewport together stagger, while a long list reveals as you scroll.
        all("[data-stagger]").forEach((container) => {
          const items = gsap.utils.toArray<HTMLElement>(container.children);
          if (items.length === 0) return;

          gsap.set(items, { opacity: 0, y: 32 });
          ScrollTrigger.batch(items, {
            start: "top 90%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: DURATION.base,
                ease: EASE,
                stagger: 0.1,
                overwrite: "auto",
              }),
          });
        });
      });

      // ── Heavy effect: parallax. Desktop only + motion allowed. ───────────────
      mm.add(`${DESKTOP_QUERY} and ${NO_MOTION_PREF_QUERY}`, () => {
        all("[data-parallax]").forEach((el) => {
          const parsed = Number.parseFloat(el.dataset.parallax ?? "");
          const amount = Number.isFinite(parsed) ? parsed : 10;

          gsap.fromTo(
            el,
            { y: -amount },
            {
              y: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      // Measure once the browser has laid the new page out.
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: scopeRef, dependencies: [pathname], revertOnUpdate: true },
  );

  // display: contents → the wrapper exists only as the GSAP scope; it adds no box,
  // so layout is identical to rendering {children} directly.
  return (
    <div ref={scopeRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
