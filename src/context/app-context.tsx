"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoOpportunities } from "@/data/opportunities";
import {
  createOpportunityId,
  type Opportunity,
  type OpportunityInput,
} from "@/lib/opportunities";

type ThemeMode = "light" | "dark";
type AuthUser = {
  email: string;
  displayName: string;
};

interface AppContextValue {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
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
  setTheme: (mode: ThemeMode) => void;
  login: (input: { email: string; password: string }) => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  opportunities: "kaaryab-opportunities",
  savedIds: "kaaryab-saved-opportunities",
  followedOrganizationSlugs: "kaaryab-followed-organizations",
  theme: "kaaryab-theme",
  user: "kaaryab-session-user",
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

function getDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "User";
  const normalized = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  if (!normalized) return "User";

  return normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(demoOpportunities);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followedOrganizationSlugs, setFollowedOrganizationSlugs] = useState<string[]>([]);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedOpportunities = safeParse<Opportunity[]>(
      window.localStorage.getItem(STORAGE_KEYS.opportunities),
      demoOpportunities
    );
    const storedSavedIds = safeParse<string[]>(
      window.localStorage.getItem(STORAGE_KEYS.savedIds),
      []
    );
    const storedFollowedOrganizationSlugs = safeParse<string[]>(
      window.localStorage.getItem(STORAGE_KEYS.followedOrganizationSlugs),
      []
    );
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme) as ThemeMode | null;
    const storedUser = safeParse<AuthUser | null>(
      window.localStorage.getItem(STORAGE_KEYS.user),
      null
    );

    // We intentionally sync persisted client state after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpportunities(storedOpportunities.length > 0 ? storedOpportunities : demoOpportunities);
    setSavedIds(storedSavedIds);
    setFollowedOrganizationSlugs(storedFollowedOrganizationSlugs);
    setThemeState(storedTheme === "dark" ? "dark" : "light");
    setUser(storedUser);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEYS.opportunities, JSON.stringify(opportunities));
  }, [hydrated, opportunities]);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEYS.savedIds, JSON.stringify(savedIds));
  }, [hydrated, savedIds]);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      STORAGE_KEYS.followedOrganizationSlugs,
      JSON.stringify(followedOrganizationSlugs)
    );
  }, [hydrated, followedOrganizationSlugs]);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [hydrated, theme]);

  useEffect(() => {
    if (!hydrated) return;

    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [hydrated, user]);

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
  const login = ({ email }: { email: string; password: string }) => {
    setUser({ email, displayName: getDisplayName(email) });
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        opportunities,
        savedIds,
        followedOrganizationSlugs,
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
        setTheme,
        login,
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
