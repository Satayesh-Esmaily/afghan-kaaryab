"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThemeMode } from "@/lib/app-state";
import { createThemeCookie } from "@/lib/theme-preferences";

export function useThemeState(initialTheme: ThemeMode) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document.cookie = createThemeCookie(theme);
  }, [theme]);

  return useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );
}
