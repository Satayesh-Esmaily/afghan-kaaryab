import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { mapSessionUserToAuthUser } from "@/lib/auth";
import type { ServerBootstrapState } from "@/lib/bootstrap";
import { createDefaultAppState } from "@/lib/app-state";
import { loadAppStoreFromSupabase } from "@/lib/supabase-app-store";

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
        theme: fallback.theme,
      },
      source: "fallback",
      prefetchedSnapshot: true,
    };
  }

  try {
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    const user = sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null;
    const snapshot = user?.id
      ? await loadAppStoreFromSupabase(supabase, user)
      : createDefaultAppState(null);

    return {
      user,
      authReady: true,
      snapshot,
      source: "server",
      prefetchedSnapshot: true,
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
        theme: fallback.theme,
      },
      source: "fallback",
      prefetchedSnapshot: true,
    };
  }
}

export type { ServerBootstrapState } from "@/lib/bootstrap";
