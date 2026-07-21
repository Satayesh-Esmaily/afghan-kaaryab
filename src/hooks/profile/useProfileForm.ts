"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas";
import { useProfileContext } from "@/context/profile-context";

export function useProfileForm() {
  const { profile, updateProfile } = useProfileContext();
  const lastSavedSnapshotRef = useRef<string>(JSON.stringify(profile));
  const saveTimerRef = useRef<number | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
    values: profile,
  });
  const watchedValues = useWatch({
    control: form.control,
    defaultValue: profile,
  }) as ProfileFormValues;

  useEffect(() => {
    lastSavedSnapshotRef.current = JSON.stringify(profile);
  }, [profile]);

  useEffect(() => {
    const nextSnapshot = JSON.stringify(watchedValues);

    if (nextSnapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      lastSavedSnapshotRef.current = nextSnapshot;
      updateProfile(watchedValues);
    }, 400);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [updateProfile, watchedValues]);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      updateProfile(values);
    },
    [updateProfile]
  );

  return useMemo(
    () => ({
      ...form,
      onSubmit,
    }),
    [form, onSubmit]
  );
}
