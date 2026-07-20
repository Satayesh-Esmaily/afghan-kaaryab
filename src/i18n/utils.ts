import { locales, rtlLocales, type Locale } from "@/i18n/config";

export function isSupportedLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getLocaleDirection(locale: string | undefined) {
  return locale && rtlLocales.has(locale as Locale) ? "rtl" : "ltr";
}

export function stripLocalePrefix(pathname: string | null | undefined) {
  if (!pathname) return "/";

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isSupportedLocale(parts[0])) {
    return `/${parts.slice(1).join("/")}` || "/";
  }

  return pathname;
}

export function getLocaleFromPathname(pathname: string | null | undefined) {
  if (!pathname) return undefined;

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isSupportedLocale(firstSegment) ? firstSegment : undefined;
}
