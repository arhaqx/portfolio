"use client";

import React from "react";
import classNames from "classnames";
import styles from "./StarBorder.module.scss";

export interface StarBorderProps<T extends React.ElementType = "button"> {
  /** Underlying HTML element or component to render (e.g. "button", "a", Link) */
  as?: T;
  /** Custom wrapper CSS class */
  className?: string;
  /** Custom inner content CSS class (padding, gap, typography overrides) */
  contentClassName?: string;
  /** Glowing star stardust color (default: theme-aware white / sky) */
  color?: string;
  /** Animation lap speed (default: "5s") */
  speed?: string;
  /** Border thickness (default: "2px") */
  thickness?: string | number;
  /** Border radius (default: "9999px") */
  radius?: string | number;
  /** Child content to display inside the button / container */
  children?: React.ReactNode;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * StarBorder
 * Production-ready React Bits animation component.
 * https://reactbits.dev/animations/star-border
 *
 * Wraps buttons, pills, or cards with a twinkling star / stardust beam
 * tracing precisely along the outer border with dynamic glow.
 */
export function StarBorder<T extends React.ElementType = "button">({
  as,
  className,
  contentClassName,
  color = "var(--star-color-default, #ffffff)",
  speed = "5s",
  thickness = "2px",
  radius,
  children,
  style,
  ...rest
}: StarBorderProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = (as || "button") as React.ElementType;

  const containerStyle: React.CSSProperties = {
    ...style,
    ["--star-color" as any]: color,
    ["--star-speed" as any]: speed,
    ["--star-thickness" as any]:
      typeof thickness === "number" ? `${thickness}px` : thickness,
    ["--star-radius" as any]: radius
      ? typeof radius === "number"
        ? `${radius}px`
        : radius
      : undefined,
  };

  return (
    <Component
      className={classNames(styles.starBorderContainer, className)}
      style={containerStyle}
      {...rest}
    >
      <div className={styles.borderGradientBottom} />
      <div className={styles.borderGradientTop} />
      <div className={classNames(styles.innerContent, contentClassName)}>{children}</div>
    </Component>
  );
}

