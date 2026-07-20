import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const locales = ["en", "fa-AF", "ps-AF"] as const;

const routes = [
  "/",
  "/about",
  "/add-opportunity",
  "/contact",
  "/dashboard",
  "/login",
  "/opportunities",
  "/organizations",
  "/profile",
  "/resume-builder",
  "/saved",
  "/settings",
  "/signup",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((currentLocale) => [
            currentLocale,
            `${siteUrl}/${currentLocale}${route === "/" ? "" : route}`,
          ])
        ) as Record<string, string>,
      },
    }))
  );
}
