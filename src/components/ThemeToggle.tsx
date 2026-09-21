"use client";

import React, { useEffect, useState } from "react";
import { ToggleButton } from "@once-ui-system/core";
import { useAppTheme } from "./Providers";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ToggleButton
        prefixIcon="dark"
        aria-label="Switch theme"
        disabled
      />
    );
  }

  // When in light mode, show moon icon ("dark") to prompt switching to dark mode
  // When in dark mode, show sun icon ("light") to prompt switching to light mode
  const icon = theme === "dark" ? "light" : "dark";
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
