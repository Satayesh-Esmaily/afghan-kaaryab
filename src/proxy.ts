import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const intlProxy = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = intlProxy(request);

  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|icon.png|apple-icon.png|logos/).*)",
  ],
};
