import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import LocaleDocumentSync from "@/components/layout/LocaleDocumentSync";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <LocaleDocumentSync />
      <AppShell>{children}</AppShell>
    </NextIntlClientProvider>
  );
}
