import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import Providers from "@/components/layout/Providers";
import AppShell from "@/components/layout/AppShell";
import LocaleDocumentSync from "@/components/layout/LocaleDocumentSync";
import { locales } from "@/i18n/config";
import { loadServerBootstrap } from "@/lib/supabase/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const [locale, messages, bootstrap] = await Promise.all([getLocale(), getMessages(), loadServerBootstrap()]);

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <Providers bootstrap={bootstrap}>
        <LocaleDocumentSync />
        <AppShell>{children}</AppShell>
      </Providers>
    </NextIntlClientProvider>
  );
}
