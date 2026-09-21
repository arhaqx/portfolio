"use client";

import React, { useEffect, useState } from "react";
import { ToggleButton, useTheme } from "@once-ui-system/core";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    let initial: string | null = null;
    try {
      initial = localStorage.getItem("data-theme");
    } catch {}

    if (initial !== "dark" && initial !== "light") {
      initial = "light";
      try {
        localStorage.setItem("data-theme", "light");
      } catch {}
    }

    document.documentElement.setAttribute("data-theme", initial);
    setCurrentTheme(initial as "light" | "dark");
  }, []);

  useEffect(() => {
    const active =
      document.documentElement.getAttribute("data-theme") ||
      resolvedTheme ||
      theme ||
      "light";
    if (active === "dark" || active === "light") {
      setCurrentTheme(active as "light" | "dark");
    }
  }, [theme, resolvedTheme]);

  const handleToggle = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("data-theme", nextTheme);
    } catch {}
    try {
      setTheme(nextTheme);
    } catch {}
  };

  if (!mounted) {
    return (
      <ToggleButton
        prefixIcon="dark"
        aria-label="Switch theme"
        disabled
      />
    );
  }

  const icon = currentTheme === "dark" ? "light" : "dark";
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={handleToggle}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
