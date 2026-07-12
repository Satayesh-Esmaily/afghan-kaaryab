"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoOpportunities } from "@/data/opportunities";
import {
  createOpportunityId,
  type Opportunity,
  type OpportunityInput,
} from "@/lib/opportunities";

type ThemeMode = "light" | "dark";
export type ResumeTemplateId = "classic" | "modern" | "compact";
type AuthUser = {
  email: string;
  displayName: string;
};

export type JobSeekerProfile = {
  fullName: string;
  headline: string;
  avatarUrl: string;
  resumeUrl: string;
  skills: string;
  experience: string;
  education: string;
  languages: string;
  documents: string;
  portfolioUrl: string;
  introVideoUrl: string;
  location: string;
  phone: string;
  bio: string;
  resumeTemplate: ResumeTemplateId;
};

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
  login: (input: { email: string; password: string }) => void;
  signup: (input: { fullName: string; email: string; password: string }) => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  opportunities: "kaaryab-opportunities",
  savedIds: "kaaryab-saved-opportunities",
  followedOrganizationSlugs: "kaaryab-followed-organizations",
  profile: "kaaryab-jobseeker-profile",
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

function createDefaultProfile(user: AuthUser | null): JobSeekerProfile {
  return {
    fullName: user?.displayName ?? "Your name",
    headline: "Job seeker in Afghanistan",
    avatarUrl: "",
    resumeUrl: "",
    skills: "Communication, Microsoft Office, Teamwork",
    experience: "Add your latest work experience here.",
    education: "Add your education background here.",
    languages: "Dari, Pashto, English",
    documents: "CV, national ID, certificates",
    portfolioUrl: "",
    introVideoUrl: "",
    location: "Kabul",
    phone: "",
    bio: "Use this profile to highlight your background, skills, and documents.",
    resumeTemplate: "modern",
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(demoOpportunities);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followedOrganizationSlugs, setFollowedOrganizationSlugs] = useState<string[]>([]);
  const [profile, setProfile] = useState<JobSeekerProfile>(createDefaultProfile(null));
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
    const storedProfile = safeParse<JobSeekerProfile | null>(
      window.localStorage.getItem(STORAGE_KEYS.profile),
      null
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
    const defaultProfile = createDefaultProfile(storedUser);
    setProfile(
      storedProfile
        ? {
            ...defaultProfile,
            ...storedProfile,
            resumeTemplate: storedProfile.resumeTemplate ?? defaultProfile.resumeTemplate,
          }
        : defaultProfile
    );
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

    window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [hydrated, profile]);

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
  const updateProfile = (input: Partial<JobSeekerProfile>) => {
    setProfile((current) => ({
      ...current,
      ...input,
    }));
  };
  const login = ({ email }: { email: string; password: string }) => {
    const nextUser = { email, displayName: getDisplayName(email) };
    setUser(nextUser);
    setProfile((current) => {
      if (current.fullName && current.fullName !== "Your name") {
        return current;
      }

      return createDefaultProfile(nextUser);
    });
  };
  const signup = ({ fullName, email }: { fullName: string; email: string; password: string }) => {
    const nextUser = {
      email,
      displayName: fullName.trim() || getDisplayName(email),
    };
    setUser(nextUser);
    setProfile((current) => ({
      ...createDefaultProfile(nextUser),
      ...current,
      fullName: nextUser.displayName,
    }));
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
