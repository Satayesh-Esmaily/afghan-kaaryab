"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createOpportunityId, type Opportunity, type OpportunityInput } from "@/lib/opportunities";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import {
  createDefaultAppState,
  createDefaultProfile,
  getDisplayName,
  normalizeAppState,
  type AppStatePayload,
  type AuthUser,
  type ResumeTemplateId,
  type ThemeMode,
  type JobSeekerProfile,
} from "@/lib/app-state";

interface AppContextValue {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
  profile: JobSeekerProfile;
  theme: ThemeMode;
  hydrated: boolean;
  user: AuthUser | null;
  authenticated: boolean;
  addOpportunity: (input: OpportunityInput) => Opportunity;
  updateOpportunity: (id: string, input: OpportunityInput) => void;
  deleteOpportunity: (id: string) => void;
  toggleSaved: (id: string) => void;
  clearSaved: () => void;
  isSaved: (id: string) => boolean;
  toggleFollowOrganization: (slug: string) => void;
  isFollowingOrganization: (slug: string) => boolean;
  updateProfile: (input: Partial<JobSeekerProfile>) => void;
  setTheme: (mode: ThemeMode) => void;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const STORAGE_KEYS = {
  appStatePrefix: "kaaryab-app-state",
} as const;

const AppContext = createContext<AppContextValue | null>(null);

function safeParse<T>(value: string | null, fallback: T) {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getAppStateStorageKey(key: string) {
  return `${STORAGE_KEYS.appStatePrefix}:${key}`;
}

function getAppStateKey(user: AuthUser | null) {
  return user?.email ?? "main";
}

function createLocalStoragePayload(payload: AppStatePayload): AppStatePayload {
  return {
    ...payload,
    profile: {
      ...payload.profile,
      avatarUrl: "",
      resumeUrl: "",
      certificationEntries: payload.profile.certificationEntries.map(stripAttachmentUrl),
      awardEntries: payload.profile.awardEntries.map(stripAttachmentUrl),
      documentEntries: payload.profile.documentEntries.map(stripAttachmentUrl),
    },
  };
}

function stripAttachmentUrl<T extends { attachmentUrl: string }>(entry: T): T {
  return {
    ...entry,
    attachmentUrl: "",
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(createDefaultAppState().opportunities);
  const [savedIds, setSavedIds] = useState<string[]>(createDefaultAppState().savedIds);
  const [followedOrganizationSlugs, setFollowedOrganizationSlugs] = useState<string[]>(
    createDefaultAppState().followedOrganizationSlugs
  );
  const [profile, setProfile] = useState<JobSeekerProfile>(createDefaultAppState().profile);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [remoteStateSyncEnabled, setRemoteStateSyncEnabled] = useState(true);
  const saveTimerRef = useRef<number | null>(null);
  const activeAppStateKey = getAppStateKey(user);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;

      const sessionUser = data.session?.user;
      if (!sessionUser?.email) {
        setUser(null);
        return;
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        displayName:
          sessionUser.user_metadata?.full_name ??
          sessionUser.user_metadata?.name ??
          getDisplayName(sessionUser.email),
      });
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;

      if (!sessionUser?.email) {
        setUser(null);
        return;
      }

      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        displayName:
          sessionUser.user_metadata?.full_name ??
          sessionUser.user_metadata?.name ??
          getDisplayName(sessionUser.email),
      });
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadState() {
      const storageKey = getAppStateStorageKey(activeAppStateKey);
      const cachedState = safeParse<Partial<AppStatePayload> | null>(
        window.localStorage.getItem(storageKey),
        null
      );

      let remoteState: Partial<AppStatePayload> | null = null;
      const supabase = getSupabaseBrowserClient();

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("app_state")
            .select("payload")
            .eq("id", activeAppStateKey)
            .maybeSingle();

          if (!error && data?.payload) {
            remoteState = data.payload as Partial<AppStatePayload>;
            setRemoteStateSyncEnabled(true);
          } else if (error) {
            setRemoteStateSyncEnabled(false);
          }
        } catch {
          remoteState = null;
          setRemoteStateSyncEnabled(false);
        }
      }

      const nextState = normalizeAppState(
        remoteState ?? cachedState,
        remoteState?.user ?? cachedState?.user ?? user
      );

      setOpportunities(nextState.opportunities);
      setSavedIds(nextState.savedIds);
      setFollowedOrganizationSlugs(nextState.followedOrganizationSlugs);
      setProfile(nextState.profile);
      setThemeState(nextState.theme);

      if (!supabase) {
        setUser(nextState.user);
      }

      setHydrated(true);
    }

    void loadState();
  }, [activeAppStateKey]);

  useEffect(() => {
    if (!hydrated) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [hydrated, theme]);

  useEffect(() => {
    if (!hydrated) return;

    const storageKey = getAppStateStorageKey(activeAppStateKey);
    const payload = {
      opportunities,
      savedIds,
      followedOrganizationSlugs,
      profile,
      theme,
      user,
    };
    const localStoragePayload = createLocalStoragePayload(payload);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(localStoragePayload));
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        const safePayload = {
          ...localStoragePayload,
        };

        try {
          window.localStorage.setItem(storageKey, JSON.stringify(safePayload));
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      } else {
        throw error;
      }
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    const supabase = getSupabaseBrowserClient();

    if (supabase && remoteStateSyncEnabled) {
      saveTimerRef.current = window.setTimeout(() => {
        void (async () => {
          try {
            const { error } = await supabase.from("app_state").upsert({
              id: activeAppStateKey,
              payload,
              updated_at: new Date().toISOString(),
            });

            if (error) {
              setRemoteStateSyncEnabled(false);
            }
          } catch {
            setRemoteStateSyncEnabled(false);
            // Ignore persistence errors and keep the UI responsive.
          }
        })();
      }, 250);
    }

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [
    hydrated,
    opportunities,
    savedIds,
    followedOrganizationSlugs,
    profile,
    theme,
    user,
    activeAppStateKey,
    remoteStateSyncEnabled,
  ]);

  const addOpportunity = (input: OpportunityInput) => {
    const opportunity: Opportunity = {
      ...input,
      id: createOpportunityId(),
      submittedAt: new Date().toISOString(),
    };

    setOpportunities((current) => [opportunity, ...current]);
    return opportunity;
  };

  const updateOpportunity = (id: string, input: OpportunityInput) => {
    setOpportunities((current) =>
      current.map((opportunity) =>
        opportunity.id === id
          ? {
              ...opportunity,
              ...input,
            }
          : opportunity
      )
    );
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
    setSavedIds((current) => current.filter((savedId) => savedId !== id));
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]
    );
  };

  const clearSaved = () => setSavedIds([]);

  const isSaved = (id: string) => savedIds.includes(id);

  const toggleFollowOrganization = (slug: string) => {
    setFollowedOrganizationSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current]
    );
  };

  const isFollowingOrganization = (slug: string) => followedOrganizationSlugs.includes(slug);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
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

    setUser({
      id: signedInUser.id,
      email: signedInUser.email,
      displayName:
        signedInUser.user_metadata?.full_name ??
        signedInUser.user_metadata?.name ??
        getDisplayName(signedInUser.email),
    });
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
          full_name: fullName.trim() || getDisplayName(email),
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

    setUser({
      id: signedInUser.id,
      email: signedInUser.email,
      displayName:
        signedInUser.user_metadata?.full_name ??
        signedInUser.user_metadata?.name ??
        (fullName.trim() || getDisplayName(signedInUser.email)),
    });

    return { needsConfirmation: false };
  };
  const logout = async () => {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setProfile(createDefaultProfile(null));
  };

  return (
    <AppContext.Provider
      value={{
        opportunities,
        savedIds,
        followedOrganizationSlugs,
        profile,
        theme,
        hydrated,
        user,
        authenticated: Boolean(user),
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        toggleSaved,
        clearSaved,
        isSaved,
        toggleFollowOrganization,
        isFollowingOrganization,
        updateProfile,
        setTheme,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useAppData must be used within AppProvider");
  }

  return value;
}

export type { ResumeTemplateId };
