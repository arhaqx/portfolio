"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BorderStyle,
  ChartMode,
  ChartVariant,
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
  NeutralColor,
  ScalingSize,
  Schemes,
  SolidStyle,
  SolidType,
  SurfaceStyle,
  Theme,
  ThemeProvider,
  ToastProvider,
  TransitionStyle,
} from "@once-ui-system/core";
import { style, dataStyle } from "../resources";
import { iconLibrary } from "../resources/icons";

interface AppThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const AppThemeContext = createContext<AppThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useAppTheme = () => useContext(AppThemeContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("data-theme");
    } catch {}

    if (saved === "dark") {
      setCurrentTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      // Default strictly to light mode
      setCurrentTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
      try {
        localStorage.setItem("data-theme", "light");
      } catch {}
    }
  }, []);

  const handleToggle = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("data-theme", nextTheme);
    } catch {}
  };

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("data-theme", newTheme);
    } catch {}
  };

  return (
    <AppThemeContext.Provider
      value={{
        theme: currentTheme,
        toggleTheme: handleToggle,
        setTheme: handleSetTheme,
      }}
    >
      <LayoutProvider>
        <ThemeProvider
          theme={currentTheme as Theme}
          brand={style.brand as Schemes}
          accent={style.accent as Schemes}
          neutral={style.neutral as NeutralColor}
          solid={style.solid as SolidType}
          solidStyle={style.solidStyle as SolidStyle}
          border={style.border as BorderStyle}
          surface={style.surface as SurfaceStyle}
          transition={style.transition as TransitionStyle}
          scaling={style.scaling as ScalingSize}
        >
          <DataThemeProvider
            variant={dataStyle.variant as ChartVariant}
            mode={dataStyle.mode as ChartMode}
            height={dataStyle.height}
            axis={{
              stroke: dataStyle.axis.stroke,
            }}
            tick={{
              fill: dataStyle.tick.fill,
              fontSize: dataStyle.tick.fontSize,
              line: dataStyle.tick.line,
            }}
          >
            <ToastProvider>
              <IconProvider icons={iconLibrary}>{children}</IconProvider>
            </ToastProvider>
          </DataThemeProvider>
        </ThemeProvider>
      </LayoutProvider>
    </AppThemeContext.Provider>
  );
}
