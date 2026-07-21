"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createDefaultAppState, type AuthUser } from "@/lib/app-state";
import { loadAppStore, type LoadedAppStore } from "@/lib/supabase-app-store";
import { demoOpportunities } from "@/data/opportunities";

const fallbackSnapshot = (user: AuthUser | null): LoadedAppStore => {
  const defaultState = createDefaultAppState(user);

  return {
    opportunities: demoOpportunities,
    savedIds: defaultState.savedIds,
    followedOrganizationSlugs: defaultState.followedOrganizationSlugs,
    profile: defaultState.profile,
    theme: defaultState.theme,
  };
};

export function useAppBootstrap(
  user: AuthUser | null,
  authReady: boolean,
  initialSnapshot: LoadedAppStore | null,
  useServerBootstrap: boolean
) {
  const [snapshot, setSnapshot] = useState<LoadedAppStore>(() => initialSnapshot ?? fallbackSnapshot(user));
  const [hydrated, setHydrated] = useState(() => Boolean(useServerBootstrap && initialSnapshot));
  const [revision, setRevision] = useState(0);
  const skipInitialLoadRef = useRef(Boolean(useServerBootstrap && initialSnapshot));
  const lastUserIdRef = useRef<string | null>(user?.id ?? null);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const currentUserId = user?.id ?? null;

    if (skipInitialLoadRef.current && lastUserIdRef.current === currentUserId) {
      skipInitialLoadRef.current = false;
      lastUserIdRef.current = currentUserId;
      return;
    }

    let cancelled = false;
    lastUserIdRef.current = currentUserId;

    void loadAppStore(user)
      .then((next) => {
        if (cancelled) return;
        setSnapshot(next);
        setHydrated(true);
        setRevision((current) => current + 1);
      })
      .catch(() => {
        if (cancelled) return;
        setSnapshot(fallbackSnapshot(user));
        setHydrated(true);
        setRevision((current) => current + 1);
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, user]);

  return useMemo(
    () => ({
      snapshot,
      hydrated,
      revision,
    }),
    [hydrated, revision, snapshot]
  );
}
