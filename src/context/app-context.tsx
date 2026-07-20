"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createOpportunityId, type Opportunity, type OpportunityInput } from "@/lib/opportunities";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import {
  createDefaultAppState,
  createDefaultProfile,
  getDisplayName,
  type AppStatePayload,
  type AuthUser,
  type ResumeTemplateId,
  type ThemeMode,
  type JobSeekerProfile,
} from "@/lib/app-state";
import {
  clearSavedOpportunitiesStore,
  deleteOpportunityStore,
  loadAppStore,
  saveOpportunityStore,
  saveProfileStore,
  setFollowedOrganization,
  setSavedOpportunity,
} from "@/lib/supabase-app-store";
import { AuthContextProvider, type AuthContextValue, useAuthContext } from "@/context/auth-context";
import { OpportunitiesContextProvider, type OpportunitiesContextValue, useOpportunitiesContext } from "@/context/opportunities-context";
import { ProfileContextProvider, type ProfileContextValue, useProfileContext } from "@/context/profile-context";

function getDisplayNameFromEmail(email: string) {
  return getDisplayName(email);
}

function mapSessionUserToAuthUser(sessionUser: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; name?: string };
}): AuthUser {
  const email = sessionUser.email ?? "";

  return {
    id: sessionUser.id,
    email,
    displayName:
      sessionUser.user_metadata?.full_name ??
      sessionUser.user_metadata?.name ??
      getDisplayNameFromEmail(email),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const defaultState = createDefaultAppState();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultState.opportunities);
  const [savedIds, setSavedIds] = useState<string[]>(defaultState.savedIds);
  const [followedOrganizationSlugs, setFollowedOrganizationSlugs] = useState<string[]>(
    defaultState.followedOrganizationSlugs
  );
  const [profile, setProfile] = useState<JobSeekerProfile>(defaultState.profile);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const profileSaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;

        const sessionUser = data.session?.user;
        setUser(sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null);
        setAuthReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setAuthReady(true);
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    void (async () => {
      const nextState = await loadAppStore(user);

      if (cancelled) return;

      setOpportunities(nextState.opportunities);
      setSavedIds(nextState.savedIds);
      setFollowedOrganizationSlugs(nextState.followedOrganizationSlugs);
      setProfile(nextState.profile);
      setThemeState(nextState.theme);
      setHydrated(true);
      setInitialLoadComplete(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, user]);

  useEffect(() => {
    if (!hydrated) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [hydrated, theme]);

  useEffect(() => {
    if (!hydrated || !initialLoadComplete || !user?.id) {
      return;
    }

    if (profileSaveTimerRef.current) {
      window.clearTimeout(profileSaveTimerRef.current);
    }

    profileSaveTimerRef.current = window.setTimeout(() => {
      void saveProfileStore(user.id, profile, theme);
    }, 450);

    return () => {
      if (profileSaveTimerRef.current) {
        window.clearTimeout(profileSaveTimerRef.current);
      }
    };
  }, [hydrated, initialLoadComplete, profile, theme, user?.id]);

  const addOpportunity = (input: OpportunityInput) => {
    const opportunity: Opportunity = {
      ...input,
      id: createOpportunityId(),
      submittedAt: new Date().toISOString(),
    };

    setOpportunities((current) => [opportunity, ...current]);

    if (user?.id) {
      void saveOpportunityStore(opportunity, user.id);
    }

    return opportunity;
  };

  const updateOpportunity = (id: string, input: OpportunityInput) => {
    setOpportunities((current) => {
      const next = current.map((opportunity) =>
        opportunity.id === id
          ? {
              ...opportunity,
              ...input,
            }
          : opportunity
      );

      const updatedOpportunity = next.find((item) => item.id === id);
      if (updatedOpportunity && user?.id) {
        void saveOpportunityStore(updatedOpportunity, user.id);
      }

      return next;
    });
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
    setSavedIds((current) => current.filter((savedId) => savedId !== id));

    void deleteOpportunityStore(id);
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      if (user?.id) {
        void setSavedOpportunity(user.id, id, next.includes(id));
      }
      return next;
    });
  };

  const clearSaved = () => {
    setSavedIds([]);

    if (user?.id) {
      void clearSavedOpportunitiesStore(user.id);
    }
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleFollowOrganization = (slug: string) => {
    setFollowedOrganizationSlugs((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];
      if (user?.id) {
        void setFollowedOrganization(user.id, slug, next.includes(slug));
      }
      return next;
    });
  };

  const isFollowingOrganization = (slug: string) => followedOrganizationSlugs.includes(slug);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const updateProfile = (input: Partial<JobSeekerProfile>) => {
    setProfile((current) => ({
      ...current,
      ...input,
    }));
  };

  function getFriendlyAuthError(error: unknown, fallback: string) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("invalid login credentials")) {
      return "Email or password is incorrect.";
    }

    if (message.includes("user already registered")) {
      return "This email is already registered. Please sign in instead.";
    }

    if (message.includes("email not confirmed")) {
      return "Please confirm your email before signing in.";
    }

    if (message.includes("signup disabled")) {
      return "Account creation is currently unavailable.";
    }

    return error instanceof Error && error.message ? error.message : fallback;
  }

  const login = async ({ email, password }: { email: string; password: string }) => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Authentication is temporarily unavailable.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(getFriendlyAuthError(error, "We could not sign you in."));
    }

    const signedInUser = data.session?.user ?? data.user;

    if (!signedInUser?.email) {
      throw new Error("Unable to sign in.");
    }

    setUser(mapSessionUserToAuthUser(signedInUser));
  };

  const signup = async ({
    fullName,
    email,
    password,
  }: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Authentication is temporarily unavailable.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim() || getDisplayNameFromEmail(email),
        },
      },
    });

    if (error) {
      throw new Error(getFriendlyAuthError(error, "We could not create your account."));
    }

    const signedInUser = data.session?.user;

    if (!signedInUser?.email) {
      return { needsConfirmation: true };
    }

    setUser(mapSessionUserToAuthUser(signedInUser));
    return { needsConfirmation: false };
  };

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setSavedIds([]);
    setFollowedOrganizationSlugs([]);
    setProfile(createDefaultProfile(null));
    setThemeState("light");
    setInitialLoadComplete(false);
  };

  const authValue = useMemo<AuthContextValue>(
    () => ({
      user,
      authenticated: Boolean(user),
      hydrated,
      authReady,
      theme,
      setTheme,
      login,
      signup,
      logout,
    }),
    [authReady, hydrated, login, logout, setTheme, signup, theme, user]
  );

  const profileValue = useMemo<ProfileContextValue>(
    () => ({
      profile,
      updateProfile,
      setTheme,
    }),
    [profile, updateProfile]
  );

  const opportunitiesValue = useMemo<OpportunitiesContextValue>(
    () => ({
      opportunities,
      savedIds,
      followedOrganizationSlugs,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      toggleSaved,
      clearSaved,
      isSaved,
      toggleFollowOrganization,
      isFollowingOrganization,
    }),
    [
      addOpportunity,
      clearSaved,
      deleteOpportunity,
      followedOrganizationSlugs,
      isFollowingOrganization,
      isSaved,
      opportunities,
      savedIds,
      toggleFollowOrganization,
      toggleSaved,
      updateOpportunity,
    ]
  );

  return (
    <AuthContextProvider value={authValue}>
      <ProfileContextProvider value={profileValue}>
        <OpportunitiesContextProvider value={opportunitiesValue}>{children}</OpportunitiesContextProvider>
      </ProfileContextProvider>
    </AuthContextProvider>
  );
}

export function useAppData() {
  const auth = useAuthContext();
  const profile = useProfileContext();
  const opportunities = useOpportunitiesContext();

  return {
    ...auth,
    ...profile,
    ...opportunities,
  };
}

export type { ResumeTemplateId };
