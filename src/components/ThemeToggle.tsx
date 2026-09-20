"use client";

import React, { useEffect, useState } from "react";
import { ToggleButton, useTheme } from "@once-ui-system/core";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    const initial =
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("data-theme") ||
      "light";
    setCurrentTheme(initial);
  }, []);

  useEffect(() => {
    const active =
      document.documentElement.getAttribute("data-theme") || theme || "light";
    setCurrentTheme(active);
  }, [theme]);

  const handleToggle = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("data-theme", nextTheme);
    try {
      setTheme(nextTheme);
    } catch {
      // Safe fallback
    }
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
