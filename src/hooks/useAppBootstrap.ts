"use client";

import { useEffect, useMemo, useState } from "react";
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

export function useAppBootstrap(user: AuthUser | null, authReady: boolean) {
  const [snapshot, setSnapshot] = useState<LoadedAppStore>(() => fallbackSnapshot(user));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    let cancelled = false;

    setHydrated(false);

    void loadAppStore(user)
      .then((next) => {
        if (cancelled) return;
        setSnapshot(next);
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSnapshot(fallbackSnapshot(user));
        setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.id]);

  return useMemo(
    () => ({
      snapshot,
      hydrated,
    }),
    [hydrated, snapshot]
  );
}
