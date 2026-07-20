import "server-only";

import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  const locale = isLocale(resolvedLocale) ? resolvedLocale : defaultLocale;

  const messages = await import(`@/messages/${locale}.json`).then((module) => module.default);

  return {
    locale,
    messages,
    timeZone: "Asia/Kabul",
  };
});
