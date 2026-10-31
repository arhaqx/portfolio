"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./DepthCard.module.scss";

export interface DepthCardLayer {
  image: string;
  depth: number;
  className?: string;
  alt?: string;
}

export interface DepthCardProps {
  /** Single background or featured image URL */
  image?: string;
  /** Stack of parallax layers with individual depth multipliers */
  layers?: DepthCardLayer[];
  /** Card title (used when rendering standard layout) */
  title?: string;
  /** Card description (used when rendering standard layout) */
  description?: string;
  /** Explicit card width */
  width?: string | number;
  /** Explicit card height */
  height?: string | number;
  /** Maximum 3D rotation in degrees (default: 15) */
  maxRotation?: number;
  /** Maximum translation shift in pixels (default: 15) */
  maxTranslation?: number;
  /** Enable dynamic cursor-following spotlight effect (default: true) */
  spotlight?: boolean;
  /** Custom spotlight color (default: liquid obsidian specular glow) */
  spotlightColor?: string;
  /** Entry reveal animation type (default: "none") */
  revealAnimation?: "slide" | "fade" | "scale" | "none";
  /** Stagger reveal delay in milliseconds */
  staggerDelay?: number;
  /** Disable tilt physics on touch devices / mobile screens (default: true) */
  disableOnMobile?: boolean;
  /** Optional link destination if entire card is a link */
  href?: string;
  /** Link target attribute */
  target?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional wrapper CSS class */
  className?: string;
  /** Additional content body CSS class */
  contentClassName?: string;
  /** Custom children (e.g. Carousel, custom badges, links) */
  children?: React.ReactNode;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

interface DepthCardContextValue {
  isHovered: boolean;
  isMobile: boolean;
}

const DepthCardContext = createContext<DepthCardContextValue>({
  isHovered: false,
  isMobile: false,
});

export const useDepthCard = () => useContext(DepthCardContext);

export interface DepthLayerProps {
  /** Relative 3D elevation depth in pixels (e.g. 15, 30, 45) */
  depth?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
  /** Children to render inside this depth plane */
  children: React.ReactNode;
}

/**
 * DepthLayer
 * Renders child elements at a specific 3D elevation plane with GPU-accelerated
 * parallax translation coordinated with the parent DepthCard.
 */
export const DepthLayer: React.FC<DepthLayerProps> = ({
  depth = 20,
  className,
  style,
  children,
}) => {
  const layerStyle: React.CSSProperties = {
    ...style,
    // CSS custom variables passed down to coordinate hardware accelerated translation
    ["--layer-z" as any]: `${depth}px`,
    ["--layer-factor" as any]: depth * 0.045,
  };

  return (
    <div className={classNames(styles.depthLayer, className)} style={layerStyle}>
      {children}
    </div>
  );
};

/**
 * DepthCard
 * Production-ready React Bits Pro DepthCard component.
 * Features:
 * - 60/120 FPS continuous 3D tilt perspective tracking with mouse coordinates
 * - Multi-layer parallax depth translation (foreground floats, background recedes)
 * - Cursor-following dynamic spotlight & specular rim glare
 * - Apple visionOS-inspired liquid obsidian glass plate styling
 * - Mobile & reduced-motion accessibility fallbacks
 */
export const DepthCard: React.FC<DepthCardProps> = ({
  image,
  layers = [],
  title,
  description,
  width,
  height,
  maxRotation = 14,
  maxTranslation = 14,
  spotlight = true,
  spotlightColor,
  revealAnimation = "none",
  staggerDelay = 0,
  disableOnMobile = true,
  href,
  target,
  onClick,
  className,
  contentClassName,
  children,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Physics state (managed via refs to ensure zero React re-render overhead during cursor motion)
  const targetRef = useRef({
    rotX: 0,
    rotY: 0,
    transX: 0,
    transY: 0,
    spotlightX: 50,
    spotlightY: 50,
    glareAngle: 135,
    glareOpacity: 0,
  });

  const currentRef = useRef({
    rotX: 0,
    rotY: 0,
    transX: 0,
    transY: 0,
    spotlightX: 50,
    spotlightY: 50,
    glareAngle: 135,
    glareOpacity: 0,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile & touch capabilities
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const isTouch =
        window.matchMedia("(max-width: 768px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Continuous animation frame physics loop
  const updatePhysics = () => {
    const target = targetRef.current;
    const current = currentRef.current;
    const lerpFactor = 0.12; // buttery smooth response without noticeable lag

    current.rotX += (target.rotX - current.rotX) * lerpFactor;
    current.rotY += (target.rotY - current.rotY) * lerpFactor;
    current.transX += (target.transX - current.transX) * lerpFactor;
    current.transY += (target.transY - current.transY) * lerpFactor;
    current.spotlightX += (target.spotlightX - current.spotlightX) * 0.2;
    current.spotlightY += (target.spotlightY - current.spotlightY) * 0.2;
    current.glareAngle += (target.glareAngle - current.glareAngle) * 0.15;
    current.glareOpacity += (target.glareOpacity - current.glareOpacity) * 0.15;

    if (containerRef.current) {
      const el = containerRef.current;
      el.style.setProperty("--depth-rx", `${current.rotX.toFixed(2)}deg`);
      el.style.setProperty("--depth-ry", `${current.rotY.toFixed(2)}deg`);
      el.style.setProperty("--depth-tx", `${current.transX.toFixed(2)}px`);
      el.style.setProperty("--depth-ty", `${current.transY.toFixed(2)}px`);
      el.style.setProperty("--spotlight-x", `${current.spotlightX.toFixed(1)}%`);
      el.style.setProperty("--spotlight-y", `${current.spotlightY.toFixed(1)}%`);
      el.style.setProperty("--glare-angle", `${current.glareAngle.toFixed(1)}deg`);
      el.style.setProperty("--glare-opacity", `${current.glareOpacity.toFixed(2)}`);

      el.style.transform = `perspective(1200px) rotateX(${current.rotX.toFixed(2)}deg) rotateY(${current.rotY.toFixed(2)}deg) translate3d(${current.transX.toFixed(2)}px, ${current.transY.toFixed(2)}px, 0px) scale3d(1.012, 1.012, 1.012)`;
    }

    // Determine if physics has settled back to resting position
    const isSettled =
      Math.abs(target.rotX - current.rotX) < 0.01 &&
      Math.abs(target.rotY - current.rotY) < 0.01 &&
      Math.abs(target.transX - current.transX) < 0.01 &&
      Math.abs(target.transY - current.transY) < 0.01 &&
      Math.abs(target.glareOpacity - current.glareOpacity) < 0.01;

    if (!isSettled || isHoveredRef.current) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    } else {
      animFrameRef.current = null;
      if (containerRef.current) {
        containerRef.current.style.transform = "";
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile && disableOnMobile) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    // Coordinate normalized from -1 to +1 relative to center
    const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2));
    const normY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2));

    // Spotlight 0% to 100%
    const spotX = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const spotY = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    // Dynamic sheen glare angle & intensity
    const angle = Math.atan2(normY, normX) * (180 / Math.PI) + 90;
    const distance = Math.hypot(normX, normY);
    const glareOpacity = Math.min(0.75, distance * 0.6);

    targetRef.current = {
      rotX: -normY * maxRotation,
      rotY: normX * maxRotation,
      transX: normX * maxTranslation,
      transY: normY * maxTranslation,
      spotlightX: spotX,
      spotlightY: spotY,
      glareAngle: angle,
      glareOpacity,
    };

    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      setIsHovered(true);
    }

    if (animFrameRef.current === null) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);

    targetRef.current = {
      rotX: 0,
      rotY: 0,
      transX: 0,
      transY: 0,
      spotlightX: 50,
      spotlightY: 50,
      glareAngle: 135,
      glareOpacity: 0,
    };

    if (animFrameRef.current === null) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Reveal animation class
  const revealClass =
    revealAnimation === "fade"
      ? styles.revealFade
      : revealAnimation === "slide"
      ? styles.revealSlide
      : revealAnimation === "scale"
      ? styles.revealScale
      : undefined;

  const wrapperStyle: React.CSSProperties = {
    ...style,
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    animationDelay: staggerDelay > 0 ? `${staggerDelay}ms` : undefined,
  };

  const containerStyle: React.CSSProperties = {
    ...(spotlightColor ? ({ ["--spotlight-color" as any]: spotlightColor } as React.CSSProperties) : {}),
  };

  // If user passes layers or single image prop, compile layers
  const effectiveLayers: DepthCardLayer[] =
    layers.length > 0
      ? layers
      : image
      ? [{ image, depth: 15, alt: title || "Project image" }]
      : [];

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <DepthCardContext.Provider value={{ isHovered, isMobile }}>
      <div
        className={classNames(styles.depthCardWrapper, revealClass, className)}
        style={wrapperStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          className={classNames(styles.depthCardContainer, {
            [styles.isHovered]: isHovered,
            [styles.isClickable]: Boolean(href || onClick),
          })}
          style={containerStyle}
          onClick={href || onClick ? handleCardClick : undefined}
          role={href || onClick ? "button" : undefined}
          tabIndex={href || onClick ? 0 : undefined}
        >
          {/* Base liquid obsidian glass plate */}
          <div className={styles.glassPlate} />

          {/* Dynamic Spotlight */}
          {spotlight && (
            <div
              className={classNames(styles.spotlightLayer, {
                [styles.active]: isHovered && !isMobile,
              })}
            />
          )}

          {/* Dynamic Specular Glare */}
          <div
            className={classNames(styles.glareLayer, {
              [styles.active]: isHovered && !isMobile,
            })}
          />

          {/* Content Body in 3D Space */}
          <div className={classNames(styles.depthContent, contentClassName)}>
            {/* If standard layers/image prop is provided without children */}
            {effectiveLayers.length > 0 && !children && (
              <div className={styles.layersContainer}>
                {effectiveLayers.map((layer, index) => (
                  <img
                    key={index}
                    src={layer.image}
                    alt={layer.alt || title || `Layer ${index + 1}`}
                    className={classNames(styles.layerItem, layer.className)}
                    style={{
                      transform: `translate3d(calc(var(--depth-tx, 0px) * ${layer.depth * 0.05}), calc(var(--depth-ty, 0px) * ${layer.depth * 0.05}), ${layer.depth * 1.5}px)`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Standard meta if title/description provided without custom children */}
            {(title || description) && !children && (
              <div className={styles.defaultMeta}>
                {title && (
                  <DepthLayer depth={28}>
                    <h3 className={styles.defaultTitle}>{title}</h3>
                  </DepthLayer>
                )}
                {description && (
                  <DepthLayer depth={20}>
                    <p className={styles.defaultDescription}>{description}</p>
                  </DepthLayer>
                )}
              </div>
            )}

            {/* Custom Children (e.g. ProjectCard components) */}
            {children}
          </div>
        </div>
      </div>
    </DepthCardContext.Provider>
  );
};

