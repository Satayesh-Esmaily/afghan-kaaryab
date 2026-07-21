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
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    let cancelled = false;

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
