"use client";

import { useMemo } from "react";
import { AuthContextProvider, type AuthContextValue, useAuthContext } from "@/context/auth-context";
import { OpportunitiesContextProvider, type OpportunitiesContextValue, useOpportunitiesContext } from "@/context/opportunities-context";
import { ProfileContextProvider, type ProfileContextValue, useProfileContext } from "@/context/profile-context";
import { ThemeContextProvider, type ThemeContextValue, useThemeContext } from "@/context/theme-context";
import { useAuthState } from "@/hooks/useAuth";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { useOpportunitiesState } from "@/hooks/useOpportunities";
import { useProfileState } from "@/hooks/useProfile";
import { useThemeState } from "@/hooks/useTheme";
import type { ResumeTemplateId } from "@/lib/app-state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  const { snapshot, hydrated } = useAppBootstrap(auth.user, auth.authReady);
  const theme = useThemeState(snapshot.theme);
  const profile = useProfileState(snapshot.profile, auth.user?.id ?? null, theme.theme, hydrated);
  const opportunities = useOpportunitiesState({
    opportunities: snapshot.opportunities,
    savedIds: snapshot.savedIds,
    followedOrganizationSlugs: snapshot.followedOrganizationSlugs,
    userId: auth.user?.id ?? null,
    hydrated,
  });

  const authValue = useMemo<AuthContextValue>(
    () => ({
      user: auth.user,
      authenticated: auth.authenticated,
      hydrated,
      authReady: auth.authReady,
      login: auth.login,
      signup: auth.signup,
      logout: auth.logout,
    }),
    [auth.authReady, auth.authenticated, auth.login, auth.logout, auth.signup, auth.user, hydrated]
  );

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      theme: theme.theme,
      setTheme: theme.setTheme,
    }),
    [theme.setTheme, theme.theme]
  );

  const profileValue = useMemo<ProfileContextValue>(
    () => ({
      profile: profile.profile,
      updateProfile: profile.updateProfile,
    }),
    [profile.profile, profile.updateProfile]
  );

  const opportunitiesValue = useMemo<OpportunitiesContextValue>(
    () => ({
      opportunities: opportunities.opportunities,
      savedIds: opportunities.savedIds,
      followedOrganizationSlugs: opportunities.followedOrganizationSlugs,
      addOpportunity: opportunities.addOpportunity,
      updateOpportunity: opportunities.updateOpportunity,
      deleteOpportunity: opportunities.deleteOpportunity,
      toggleSaved: opportunities.toggleSaved,
      clearSaved: opportunities.clearSaved,
      isSaved: opportunities.isSaved,
      toggleFollowOrganization: opportunities.toggleFollowOrganization,
      isFollowingOrganization: opportunities.isFollowingOrganization,
    }),
    [
      opportunities.addOpportunity,
      opportunities.clearSaved,
      opportunities.deleteOpportunity,
      opportunities.followedOrganizationSlugs,
      opportunities.isFollowingOrganization,
      opportunities.isSaved,
      opportunities.opportunities,
      opportunities.savedIds,
      opportunities.toggleFollowOrganization,
      opportunities.toggleSaved,
      opportunities.updateOpportunity,
    ]
  );

  return (
    <AuthContextProvider value={authValue}>
      <ThemeContextProvider value={themeValue}>
        <ProfileContextProvider value={profileValue}>
          <OpportunitiesContextProvider value={opportunitiesValue}>{children}</OpportunitiesContextProvider>
        </ProfileContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}

export function useAppData() {
  const auth = useAuthContext();
  const theme = useThemeContext();
  const profile = useProfileContext();
  const opportunities = useOpportunitiesContext();

  return {
    ...auth,
    ...theme,
    ...profile,
    ...opportunities,
  };
}

export function useApp() {
  return useAppData();
}

export type { ResumeTemplateId };
