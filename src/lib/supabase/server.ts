import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createDefaultAppState } from "@/lib/app-state";
import { mapSessionUserToAuthUser } from "@/lib/auth";
import type { ServerBootstrapState } from "@/lib/bootstrap";
import { getServerThemeMode } from "@/lib/theme-preferences.server";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot persist cookies; Proxy refreshes sessions before render.
        }
      },
    },
  });
}

export async function loadServerBootstrap(): Promise<ServerBootstrapState> {
  const supabase = await getSupabaseServerClient();
  const theme = await getServerThemeMode();

  if (!supabase) {
    const fallback = createDefaultAppState(null);

    return {
      user: fallback.user,
      authReady: true,
      snapshot: {
        opportunities: fallback.opportunities,
        savedIds: fallback.savedIds,
        followedOrganizationSlugs: fallback.followedOrganizationSlugs,
        profile: fallback.profile,
        theme,
      },
      source: "fallback",
      prefetchedSnapshot: false,
    };
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const sessionUser = session?.user;

    const user = sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null;
    const fallback = createDefaultAppState(user);

    return {
      user,
      authReady: true,
      snapshot: {
        opportunities: fallback.opportunities,
        savedIds: fallback.savedIds,
        followedOrganizationSlugs: fallback.followedOrganizationSlugs,
        profile: fallback.profile,
        theme,
      },
      source: "server",
      prefetchedSnapshot: false,
    };
  } catch {
    const fallback = createDefaultAppState(null);

    return {
      user: fallback.user,
      authReady: true,
      snapshot: {
        opportunities: fallback.opportunities,
        savedIds: fallback.savedIds,
        followedOrganizationSlugs: fallback.followedOrganizationSlugs,
        profile: fallback.profile,
        theme,
      },
      source: "fallback",
      prefetchedSnapshot: false,
    };
  }
}

export type { ServerBootstrapState } from "@/lib/bootstrap";
