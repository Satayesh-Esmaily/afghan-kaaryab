import type { Metadata, Viewport } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Providers from "@/components/layout/Providers";
import { defaultLocale } from "@/i18n/config";
import { getLocaleDirection } from "@/i18n/utils";
import { loadServerBootstrap } from "@/lib/supabase/server";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteName = t("siteName");
  const description = t("description");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical: locale === defaultLocale ? "/" : `/${locale}`,
      languages: {
        en: siteUrl,
        "fa-AF": `${siteUrl}/fa-AF`,
        "ps-AF": `${siteUrl}/ps-AF`,
      },
    },
    openGraph: {
      title: siteName,
      description,
      url: locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
      siteName,
      type: "website",
      locale: locale === "fa-AF" ? "fa_AF" : locale === "ps-AF" ? "ps_AF" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: t("twitterDescription"),
    },
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png" },
        { url: "/logos/kaaryab-logo.png", type: "image/png" },
      ],
      shortcut: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#6E5BFF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, bootstrap] = await Promise.all([getLocale(), loadServerBootstrap()]);
  const dir = getLocaleDirection(locale);
  const theme = bootstrap.snapshot.theme;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={["h-full antialiased", theme === "dark" ? "dark" : ""].join(" ").trim()}
      style={{ colorScheme: theme }}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]"
      >
        <Providers bootstrap={bootstrap}>{children}</Providers>
      </body>
    </html>
  );
}
