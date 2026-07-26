import type { ThemeMode } from "@/lib/app-state";

export const THEME_COOKIE_NAME = "kaaryab-theme";

export function parseThemeMode(value: string | null | undefined): ThemeMode {
  return value === "dark" ? "dark" : "light";
}

export function createThemeCookie(theme: ThemeMode) {
  return `${THEME_COOKIE_NAME}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
