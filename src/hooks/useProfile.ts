"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveProfileStore } from "@/lib/supabase-app-store";
import type { JobSeekerProfile, ThemeMode } from "@/lib/app-state";

export function useProfileState(initialProfile: JobSeekerProfile, userId: string | null, theme: ThemeMode, hydrated: boolean) {
  const [profile, setProfile] = useState<JobSeekerProfile>(initialProfile);
  const profileSaveTimerRef = useRef<number | null>(null);
  const skipInitialSaveRef = useRef(true);

  const flushSave = useCallback(async () => {
    if (!hydrated || !userId) {
      return;
    }

    if (profileSaveTimerRef.current) {
      window.clearTimeout(profileSaveTimerRef.current);
      profileSaveTimerRef.current = null;
    }

    await saveProfileStore(userId, profile, theme);
  }, [hydrated, profile, theme, userId]);

  useEffect(() => {
    if (skipInitialSaveRef.current) {
      skipInitialSaveRef.current = false;
      return;
    }

    if (!hydrated || !userId) {
      return;
    }

    if (profileSaveTimerRef.current) {
      window.clearTimeout(profileSaveTimerRef.current);
    }

    profileSaveTimerRef.current = window.setTimeout(() => {
      void saveProfileStore(userId, profile, theme);
    }, 450);

    return () => {
      if (profileSaveTimerRef.current) {
        window.clearTimeout(profileSaveTimerRef.current);
      }
    };
  }, [hydrated, profile, theme, userId]);

  const updateProfile = useCallback((input: Partial<JobSeekerProfile>) => {
    setProfile((current) => ({
      ...current,
      ...input,
    }));
  }, []);

  return useMemo(
    () => ({
      profile,
      updateProfile,
      flushSave,
    }),
    [flushSave, profile, updateProfile]
  );
}
