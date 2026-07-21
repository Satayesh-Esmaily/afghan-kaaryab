"use client";

import { createContext, useContext } from "react";
import type { JobSeekerProfile } from "@/lib/app-state";

export type ProfileContextValue = {
  profile: JobSeekerProfile;
  updateProfile: (input: Partial<JobSeekerProfile>) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileContextProvider({
  value,
  children,
}: {
  value: ProfileContextValue;
  children: React.ReactNode;
}) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
  const value = useContext(ProfileContext);

  if (!value) {
    throw new Error("useProfileContext must be used within ProfileContextProvider");
  }

  return value;
}
