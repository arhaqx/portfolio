"use client";

import React, { useRef } from "react";
import Link from "next/link";
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
import { ArMonogram3D } from "./ArMonogram3D";
import { SplitText } from "@/components/SplitText";
import styles from "./HomeLayers.module.scss";

const EXPLORE_WORDS = ["work", "process", "journey"];
const EXPLORE_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Learning", href: "/learning" },
];

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
  const motionQueryRef = useRef<MediaQueryList | null>(null);
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

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      motionQueryRef.current = motionQuery;
      let wordCycle: gsap.core.Timeline | null = null;
      let exploreIsReady = false;

      const syncWordCycle = () => {
        if (!wordCycle) return;
        if (exploreIsReady && !document.hidden && !motionQuery.matches) {
          wordCycle.play();
        } else {
          wordCycle.pause();
          if (motionQuery.matches) wordCycle.pause(0);
        }
      };

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
            exploreIsReady = p >= 0.87;
            syncWordCycle();
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

      // Reveal the invitation in reading order as Frame 3 enters.
      const exploreSteps = l3.querySelectorAll<HTMLElement>("[data-explore-step]");
      if (!motionQuery.matches) {
        exploreSteps.forEach((step, index) => {
          tl.fromTo(
            step,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 6,
              ease: "power3.out",
            },
            70 + index * 2.6,
          );
        });
      }

      const rotatingWords = l3.querySelectorAll<HTMLElement>("[data-explore-word]");
      if (rotatingWords.length > 1) {
        gsap.set(rotatingWords, { yPercent: 65, autoAlpha: 0 });
        gsap.set(rotatingWords[0], { yPercent: 0, autoAlpha: 1 });
        wordCycle = gsap.timeline({ paused: true, repeat: -1 });
        rotatingWords.forEach((word, index) => {
          const nextWord = rotatingWords[(index + 1) % rotatingWords.length];
          const changeAt = (index + 1) * 4 - 0.65;
          wordCycle!
            .fromTo(word, { yPercent: 0, autoAlpha: 1 }, {
              yPercent: -65,
              autoAlpha: 0,
              duration: 0.65,
              ease: "power3.inOut",
              immediateRender: false,
            }, changeAt)
            .fromTo(nextWord, { yPercent: 65, autoAlpha: 0 }, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: "power3.inOut",
              immediateRender: false,
            }, changeAt);
        });
      }

      exploreIsReady = (tl.scrollTrigger?.progress ?? 0) >= 0.87;
      syncWordCycle();
      document.addEventListener("visibilitychange", syncWordCycle);
      motionQuery.addEventListener("change", syncWordCycle);

      // Magnetic CTA: only on fine pointers (mouse / trackpad) without reduced motion
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const magnet = magnetRef.current;
      const arrow = arrowRef.current;

      if (finePointer && magnet && arrow) {
        magnetRefs.current = {
          x: gsap.quickTo(magnet, "x", { duration: 0.6, ease: "power3" }),
          y: gsap.quickTo(magnet, "y", { duration: 0.6, ease: "power3" }),
          ax: gsap.quickTo(arrow, "x", { duration: 0.5, ease: "power3" }),
        };
      }

      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", syncWordCycle);
        motionQuery.removeEventListener("change", syncWordCycle);
        magnetRefs.current = null;
        motionQueryRef.current = null;
        wordCycle?.kill();
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
    if (!setters || !zone || motionQueryRef.current?.matches) return;

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
              FRAME 3: Explore the work, process, and journey
              ==================================================================== */}
          <section
            ref={layer3Ref}
            id="home-layer-3"
            className={`${styles.frameSection} ${styles.frameThree}`}
            aria-label="Jelajahi karya dan perjalanan saya"
          >
            <div ref={layer3ContentRef} className={styles.frameExploreHero}>
              <div className={styles.exploreContent}>
                <p className={styles.exploreEyebrow} data-explore-step>A closer look</p>
                <h2 className={styles.exploreHeroHeading} aria-label="Explore the work, process, and journey." data-explore-step>
                  <span aria-hidden="true" className={styles.exploreHeadingPrefix}>Explore the</span>
                  <span className={styles.exploreWordWindow} aria-hidden="true">
                    {EXPLORE_WORDS.map((word) => (
                      <span key={word} data-explore-word className={styles.exploreRotatingWord}>
                        {word}<span className={styles.explorePeriod}>.</span>
                      </span>
                    ))}
                  </span>
                </h2>
                <p className={styles.exploreDescription} data-explore-step>
                  Kenali perjalanan saya, jelajahi karya pilihan,{" "}
                  <br className={styles.exploreDescriptionBreak} />
                  dan temukan proses di balik setiap solusi.
                </p>

                <div
                  ref={magnetZoneRef}
                  className={styles.magnetZone}
                  onMouseMove={handleMagnetMove}
                  onMouseLeave={handleMagnetLeave}
                >
                  <div className={styles.exploreReveal} data-explore-step>
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
                <nav className={styles.exploreLinks} aria-label="Jelajahi portofolio" data-explore-step>
                  {EXPLORE_LINKS.map((link, index) => (
                    <React.Fragment key={link.href}>
                      {index > 0 ? <span className={styles.exploreLinkSeparator} aria-hidden="true">·</span> : null}
                      <Link href={link.href} className={styles.exploreLink}>{link.label}</Link>
                    </React.Fragment>
                  ))}
                </nav>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
