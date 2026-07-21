"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThemeMode } from "@/lib/app-state";

export function useThemeState(initialTheme: ThemeMode) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );
}
