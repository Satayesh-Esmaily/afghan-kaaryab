"use client";

import { createContext, useContext } from "react";
import type { ThemeMode } from "@/lib/app-state";

export type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeContextProvider({
  value,
  children,
}: {
  value: ThemeContextValue;
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }

  return value;
}
