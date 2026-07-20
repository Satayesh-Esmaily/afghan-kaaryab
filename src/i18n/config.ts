export const locales = ["en", "fa-AF", "ps-AF"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const rtlLocales = new Set<Locale>(["fa-AF", "ps-AF"]);
