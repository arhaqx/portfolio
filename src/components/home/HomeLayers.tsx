"use client";

import React, { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Heading,
  Text,
  Button,
  Avatar,
  Column,
  Badge,
  Row,
} from "@once-ui-system/core";
import { home, about, person } from "@/resources";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSmoothScroll, StarBorder } from "@/components/motion";
const ArMonogram3D = dynamic(
  () => import("./ArMonogram3D").then((m) => m.ArMonogram3D),
  { ssr: false },
);
import { SplitText } from "@/components/SplitText";
import styles from "./HomeLayers.module.scss";

const EXPLORE_WORDS = ["Let's", "Explore"];

type QuickSetter = (value: number) => void;

export const HomeLayers: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLElement>(null);
  const layer1ContentRef = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLElement>(null);
  const layer2ContentRef = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLElement>(null);
  const layer3ContentRef = useRef<HTMLDivElement>(null);

  // Frame 3 motion targets
  const exploreRevealRef = useRef<HTMLDivElement>(null);
  const magnetZoneRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const magnetRefs = useRef<{ x: QuickSetter; y: QuickSetter; ax: QuickSetter } | null>(null);

  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const root = rootRef.current;
      const l1 = layer1Ref.current;
      const l2 = layer2Ref.current;
      const l3 = layer3Ref.current;

      if (!root || !l1 || !l2 || !l3) return;

      const setInteractiveLayer = (activeLayer: 1 | 2 | 3) => {
        l1.style.pointerEvents = activeLayer === 1 ? "auto" : "none";
        l2.style.pointerEvents = activeLayer === 2 ? "auto" : "none";
        l3.style.pointerEvents = activeLayer === 3 ? "auto" : "none";
      };

      // Initial state: Frame 1 visible, Frame 2 & 3 hidden, zero vertical movement
      gsap.set(l1, { autoAlpha: 1, y: 0 });
      gsap.set(l2, { autoAlpha: 0, y: 0 });
      gsap.set(l3, { autoAlpha: 0, y: 0 });
      setInteractiveLayer(1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.24) {
              setInteractiveLayer(1);
            } else if (p < 0.68) {
              setInteractiveLayer(2);
            } else {
              setInteractiveLayer(3);
            }
          },
        },
      });

      // Pure stationary fade-out & fade-in transitions (no vertical y translation):
      // 0 -> 10: Hold Frame 1
      // 10 -> 24: Frame 1 fades out in place
      // 24 -> 38: Frame 2 fades in in place
      // 38 -> 54: Hold Frame 2
      // 54 -> 68: Frame 2 fades out in place
      // 68 -> 82: Frame 3 fades in in place
      // 82 -> 100: Hold Frame 3
      tl.to(l1, { autoAlpha: 1, duration: 10, ease: "none" }, 0)
        .to(l1, { autoAlpha: 0, duration: 14, ease: "power2.inOut" }, 10)
        .fromTo(
          l2,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 14,
            ease: "power2.inOut",
            immediateRender: false,
          },
          24,
        )
        .to(l2, { autoAlpha: 1, duration: 16, ease: "none" }, 38)
        .to(l2, { autoAlpha: 0, duration: 14, ease: "power2.inOut" }, 54)
        .fromTo(
          l3,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 14,
            ease: "power2.inOut",
            immediateRender: false,
          },
          68,
        )
        .to(l3, { autoAlpha: 1, duration: 18, ease: "none" }, 82);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Frame 3 choreography (scroll-scrubbed, fills the previously idle hold phase):
      // 70 -> ~83.5: "Let's Explore" characters rise + blur-to-sharp, staggered
      // 80 -> 86:    "Get Started" pill wipes in left-to-right via clip-path
      // Reduced motion: skipped entirely, content stays static & fully visible.
      const exploreChars = l3.querySelectorAll<HTMLElement>("[data-explore-char]");
      const exploreReveal = exploreRevealRef.current;

      if (!prefersReducedMotion && exploreChars.length > 0) {
        tl.fromTo(
          exploreChars,
          { yPercent: 70, opacity: 0, filter: "blur(10px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 8,
            stagger: 0.5,
            ease: "power3.out",
          },
          70,
        );
      }

      if (!prefersReducedMotion && exploreReveal) {
        // All-percentage insets so GSAP can interpolate; negative insets keep hover shadow unclipped
        tl.fromTo(
          exploreReveal,
          { clipPath: "inset(-80% 100% -80% -15%)", opacity: 0 },
          {
            clipPath: "inset(-80% -15% -80% -15%)",
            opacity: 1,
            duration: 6,
            ease: "power2.out",
          },
          80,
        );
      }

      // Magnetic CTA: only on fine pointers (mouse / trackpad) without reduced motion
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const magnet = magnetRef.current;
      const arrow = arrowRef.current;

      if (!prefersReducedMotion && finePointer && magnet && arrow) {
        magnetRefs.current = {
          x: gsap.quickTo(magnet, "x", { duration: 0.6, ease: "power3" }),
          y: gsap.quickTo(magnet, "y", { duration: 0.6, ease: "power3" }),
          ax: gsap.quickTo(arrow, "x", { duration: 0.5, ease: "power3" }),
        };
      }

      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(frame);
        magnetRefs.current = null;
        tl.kill();
      };
    },
    { scope: rootRef },
  );

  const clampX = gsap.utils.clamp(-14, 14);
  const clampY = gsap.utils.clamp(-10, 10);
  const clampArrow = gsap.utils.clamp(-6, 10);

  const handleMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const setters = magnetRefs.current;
    const zone = magnetZoneRef.current;
    if (!setters || !zone) return;

    const rect = zone.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    setters.x(clampX(dx * 0.25));
    setters.y(clampY(dy * 0.3));
    // Arrow pulled slightly further + resting nudge forward for a layered feel
    setters.ax(clampArrow(dx * 0.08 + 4));
  };

  const handleMagnetLeave = () => {
    const setters = magnetRefs.current;
    if (!setters) return;
    setters.x(0);
    setters.y(0);
    setters.ax(0);
  };

  const handleScrollToLayer2 = () => {
    if (!rootRef.current || typeof window === "undefined") return;
    const rect = rootRef.current.getBoundingClientRect();
    const rootTop = rect.top + window.scrollY;
    const scrollableDistance = Math.max(
      0,
      rootRef.current.offsetHeight - window.innerHeight,
    );
    // Scroll to 45% progress (middle of Frame 2 hold phase)
    scrollTo(rootTop + scrollableDistance * 0.45);
  };

  return (
    <div ref={rootRef} className={styles.homeLayersRoot}>
      <div id="home-fixed-stage" className={styles.fixedStage}>
        <div className={styles.stageInner}>
          {/* ====================================================================
              FRAME 1: "Muhammad" (Top-Left) + 3D "AR" (Center) + "Arinal" (Bottom-Right)
              ==================================================================== */}
          <section
            ref={layer1Ref}
            id="home-layer-1"
            className={`${styles.frameSection} ${styles.frameOne}`}
            aria-label="Muhammad Arinal Hero"
          >
            <div ref={layer1ContentRef} className={styles.layerOneStage}>
              <div className={styles.heroComposition}>
                <SplitText
                  text="Muhammad"
                  tag="h1"
                  className={`${styles.heroWord} ${styles.nameTopLeft}`}
                  splitType="chars"
                  delay={45}
                  duration={1.0}
                  ease="power3.out"
                  from={{ opacity: 0, y: 45 }}
                  to={{ opacity: 1, y: 0 }}
                  hoverEffect="lift"
                  trigger="load"
                />

                <div className={styles.monogramCenter}>
                  <ArMonogram3D className={styles.monogramCanvas} />
                </div>

                <SplitText
                  text="Arinal"
                  tag="span"
                  className={`${styles.heroWord} ${styles.nameBottomRight}`}
                  aria-hidden="true"
                  splitType="chars"
                  delay={45}
                  duration={1.0}
                  ease="power3.out"
                  from={{ opacity: 0, y: 45 }}
                  to={{ opacity: 1, y: 0 }}
                  hoverEffect="lift"
                  trigger="load"
                />
              </div>

              <div className={styles.layerOneFooter}>
                <div className={styles.rulerMarks} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <button
                  type="button"
                  onClick={handleScrollToLayer2}
                  className={styles.scrollPromptBtn}
                  aria-label="Scroll ke Layer 2"
                >
                  <span>SCROLL TO EXPLORE</span>
                  <span className={styles.scrollArrow}>↓</span>
                </button>
              </div>
            </div>
          </section>

          {/* ====================================================================
              FRAME 2: Rekayasa Aplikasi Web Full-Stack, Infrastruktur Cloud & Sistem AI Otonom
              ==================================================================== */}
          <section
            ref={layer2Ref}
            id="home-layer-2"
            className={`${styles.frameSection} ${styles.frameTwo}`}
            aria-label="Ringkasan Spesialisasi"
          >
            <div ref={layer2ContentRef} className={styles.frameContainer}>
              <Column fillWidth horizontal="center" vertical="center" gap="m">
                <Column maxWidth="s" horizontal="center" align="center">
                  {home.featured.display && (
                    <Row
                      fillWidth
                      horizontal="center"
                      paddingBottom="24"
                      paddingLeft="12"
                    >
                      <Badge
                        background="brand-alpha-weak"
                        paddingX="12"
                        paddingY="4"
                        onBackground="neutral-strong"
                        textVariant="label-default-s"
                        arrow={false}
                        href={home.featured.href}
                      >
                        <Row paddingY="2">{home.featured.title}</Row>
                      </Badge>
                    </Row>
                  )}
                  <Row fillWidth horizontal="center" paddingBottom="16">
                    <Heading
                      as="h2"
                      wrap="balance"
                      variant="display-strong-l"
                      align="center"
                    >
                      {home.headline}
                    </Heading>
                  </Row>
                  <Row fillWidth horizontal="center" paddingBottom="24">
                    <Text
                      wrap="balance"
                      onBackground="neutral-weak"
                      variant="heading-default-xl"
                      align="center"
                    >
                      {home.subline}
                    </Text>
                  </Row>
                  <Row paddingTop="8" horizontal="center" paddingLeft="12">
                    <Button
                      id="about"
                      data-border="rounded"
                      href={about.path}
                      variant="secondary"
                      size="m"
                      weight="default"
                      arrowIcon
                    >
                      <Row gap="8" vertical="center" paddingRight="4">
                        {about.avatar.display && (
                          <Avatar
                            marginRight="8"
                            style={{ marginLeft: "-0.75rem" }}
                            src={person.avatar}
                            size="m"
                          />
                        )}
                        {about.title}
                      </Row>
                    </Button>
                  </Row>
                </Column>
              </Column>
            </div>
          </section>

          {/* ====================================================================
              FRAME 3: Let's Explore (Heroic) + Get Started (React Bits StarBorder)
              ==================================================================== */}
          <section
            ref={layer3Ref}
            id="home-layer-3"
            className={`${styles.frameSection} ${styles.frameThree}`}
            aria-label="Let's Explore"
          >
            <div ref={layer3ContentRef} className={styles.frameExploreHero}>
              <div className={styles.exploreHeroRow}>
                <h2 className={styles.exploreHeroHeading} aria-label="Let's Explore">
                  {EXPLORE_WORDS.map((word) => (
                    <span key={word} className={styles.exploreWord} aria-hidden="true">
                      {Array.from(word).map((char, ci) => (
                        <span key={ci} data-explore-char className={styles.exploreChar}>
                          {char}
                        </span>
                      ))}
                    </span>
                  ))}
                </h2>

                <div
                  ref={magnetZoneRef}
                  className={styles.magnetZone}
                  onMouseMove={handleMagnetMove}
                  onMouseLeave={handleMagnetLeave}
                >
                  <div ref={exploreRevealRef} className={styles.exploreReveal}>
                    <div ref={magnetRef} className={styles.magnetTarget}>
                      <StarBorder
                        as={Link}
                        href="/about"
                        color="var(--star-color-default, #ffffff)"
                        speed="4s"
                        thickness="2.5px"
                        className={styles.getStartedStarBtn}
                        contentClassName={styles.getStartedInner}
                        aria-label="Get Started - Mulai eksplorasi portofolio"
                      >
                        <span className={styles.getStartedText}>Get Started</span>
                        <span ref={arrowRef} className={styles.getStartedArrow}>
                          →
                        </span>
                      </StarBorder>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
