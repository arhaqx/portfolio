"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Flex, Row } from "@once-ui-system/core";

import { routes, display, person, about, blog, learning, work, gallery } from "@/resources";
import { LiquidMetalNavbar, type NavRouteItem } from "./LiquidMetalNavbar";
import { ArLogo } from "./ArLogo";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  const navItems: NavRouteItem[] = [
    ...(routes["/"]
      ? [{ label: "Home", href: "/", active: pathname === "/" }]
      : []),
    ...(routes["/about"]
      ? [{ label: about.label, href: "/about", active: pathname === "/about" }]
      : []),
    ...(routes["/projects"]
      ? [
          {
            label: work.label,
            href: "/projects",
            active: pathname.startsWith("/projects"),
          },
        ]
      : []),
    ...(routes["/learning"]
      ? [
          {
            label: learning.label,
            href: "/learning",
            active: pathname.startsWith("/learning"),
          },
        ]
      : []),
    ...(routes["/blog"]
      ? [
          {
            label: blog.label,
            href: "/blog",
            active: pathname.startsWith("/blog"),
          },
        ]
      : []),
    ...(routes["/gallery"]
      ? [
          {
            label: gallery.label,
            href: "/gallery",
            active: pathname.startsWith("/gallery"),
          },
        ]
      : []),
  ];

  return (
    <Row
      data-nav-autohide
      fitHeight
      className={styles.position}
      position="sticky"
      as="header"
      zIndex={9}
      fillWidth
      padding="8"
      horizontal="center"
      data-border="rounded"
      s={{
        position: "sticky",
      }}
    >
      <Row
        paddingLeft="16"
        fillWidth
        vertical="center"
        gap="16"
        s={{ hide: true }}
      >
        <Link
          href="/"
          aria-label="Beranda Muhammad Arinal Haq"
          className={styles.logoLink}
        >
          <ArLogo className={styles.logoSvg} />
        </Link>
        {display.location && (
          <Row textVariant="body-default-s" onBackground="neutral-weak">
            Semarang, Indonesia
          </Row>
        )}
      </Row>
      <Row fillWidth horizontal="center">
        <LiquidMetalNavbar items={navItems} />
      </Row>
      <Flex fillWidth horizontal="end" vertical="center" s={{ hide: true }}>
        <Flex
          paddingRight="12"
          horizontal="end"
          vertical="center"
          textVariant="body-default-s"
          gap="20"
        >
          <Flex s={{ hide: true }}>
            {display.time && <TimeDisplay timeZone={person.location} />}
          </Flex>
        </Flex>
      </Flex>
    </Row>
  );
};
