"use client";

import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas";
import { useProfileContext } from "@/context/profile-context";

export function useProfileForm() {
  const { profile, updateProfile } = useProfileContext();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
    values: profile,
  });

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
