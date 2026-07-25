import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const intlProxy = createMiddleware(routing);
const privateRoutePrefixes = [
  "/dashboard",
  "/profile",
  "/resume-builder",
  "/saved",
  "/add-opportunity",
  "/settings",
];

export async function proxy(request: NextRequest) {
  const response = intlProxy(request);
  const pathname = stripLocalePrefix(request.nextUrl.pathname);

  if (!privateRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return response;
  }

  return updateSession(request, response);
}

function stripLocalePrefix(pathname: string) {
  const localeMatch = pathname.match(/^\/(en|fa-AF|ps-AF)(?=\/|$)/);

  if (!localeMatch) {
    return pathname;
  }

  const stripped = pathname.slice(localeMatch[0].length);
  return stripped === "" ? "/" : stripped;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|sw.js|icon.png|apple-icon.png|pwa-icon.svg|pwa-192.png|pwa-512.png|logos/).*)",
  ],
};
