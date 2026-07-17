import { demoOpportunities } from "@/data/opportunities";
import type { Opportunity } from "@/lib/opportunities";

export type ThemeMode = "light" | "dark";
export type ResumeTemplateId = "classic" | "modern" | "compact";

export type ExperienceEntry = {
  id: string;
  position: string;
  organization: string;
  employmentType: string;
  currentlyWorking: boolean;
  startDate: string;
  endDate: string;
  country: string;
  province: string;
  skills: string;
  description: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  country: string;
  province: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type CertificationEntry = {
  id: string;
  title: string;
  certificationUrl: string;
  credentialId: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  description: string;
  attachmentUrl: string;
  attachmentStoragePath: string;
  attachmentFileName: string;
};

export type AwardEntry = {
  id: string;
  title: string;
  issuedBy: string;
  date: string;
  description: string;
  referenceUrl: string;
  attachmentUrl: string;
  attachmentStoragePath: string;
  attachmentFileName: string;
};

export type DocumentEntry = {
  id: string;
  title: string;
  documentType: string;
  description: string;
  attachmentUrl: string;
  attachmentStoragePath: string;
  attachmentFileName: string;
};

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export type JobSeekerProfile = {
  fullName: string;
  headline: string;
  avatarUrl: string;
  avatarStoragePath: string;
  resumeUrl: string;
  resumeStoragePath: string;
  certificationEntries: CertificationEntry[];
  awardEntries: AwardEntry[];
  documentEntries: DocumentEntry[];
  country: string;
  province: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  experienceEntries: ExperienceEntry[];
  educationEntries: EducationEntry[];
  certifications: string;
  awards: string;
  languages: string;
  documents: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  introVideoUrl: string;
  location: string;
  phone: string;
  bio: string;
  resumeTemplate: ResumeTemplateId;
};

export type AppStatePayload = {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
  profile: JobSeekerProfile;
  theme: ThemeMode;
  user: AuthUser | null;
};

export function getDisplayName(email: string) {
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

export function createDefaultProfile(user: AuthUser | null): JobSeekerProfile {
  return {
    fullName: user?.displayName ?? "Your name",
    headline: "Job seeker in Afghanistan",
    avatarUrl: "",
    avatarStoragePath: "",
    resumeUrl: "",
    resumeStoragePath: "",
    certificationEntries: [],
    awardEntries: [],
    documentEntries: [],
    country: "Afghanistan",
    province: "Kabul",
    nationality: "Afghan",
    dateOfBirth: "",
    gender: "Prefer not to say",
    address: "",
    summary: "Use this profile to highlight your background, skills, and documents.",
    skills: "Communication, Microsoft Office, Teamwork",
    experience: "",
    education: "",
    experienceEntries: [],
    educationEntries: [],
    certifications: "",
    awards: "",
    languages: "Dari, Pashto, English",
    documents: "CV, national ID, certificates",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    introVideoUrl: "",
    location: "Kabul",
    phone: "",
    bio: "Use this profile to highlight your background, skills, and documents.",
    resumeTemplate: "modern",
  };
}

export function createDefaultAppState(user: AuthUser | null = null): AppStatePayload {
  return {
    opportunities: demoOpportunities,
    savedIds: [],
    followedOrganizationSlugs: [],
    profile: createDefaultProfile(user),
    theme: "light",
    user,
  };
}

export function normalizeAppState(
  payload: Partial<AppStatePayload> | null | undefined,
  user: AuthUser | null = null
): AppStatePayload {
  const defaults = createDefaultAppState(user);

  if (!payload) {
    return defaults;
  }

  const profile = isRecord(payload.profile) ? (payload.profile as Partial<JobSeekerProfile>) : {};
  const storedUser = isValidAuthUser(payload.user) ? payload.user : user;

  return {
    opportunities: Array.isArray(payload.opportunities) ? payload.opportunities : defaults.opportunities,
    savedIds: Array.isArray(payload.savedIds) ? payload.savedIds : defaults.savedIds,
    followedOrganizationSlugs: Array.isArray(payload.followedOrganizationSlugs)
      ? payload.followedOrganizationSlugs
      : defaults.followedOrganizationSlugs,
    profile: {
      ...createDefaultProfile(storedUser ?? null),
      ...profile,
      avatarStoragePath:
        typeof profile.avatarStoragePath === "string" ? profile.avatarStoragePath : defaults.profile.avatarStoragePath,
      certificationEntries: Array.isArray(profile.certificationEntries)
        ? profile.certificationEntries
        : defaults.profile.certificationEntries,
      awardEntries: Array.isArray(profile.awardEntries) ? profile.awardEntries : defaults.profile.awardEntries,
      documentEntries: Array.isArray(profile.documentEntries) ? profile.documentEntries : defaults.profile.documentEntries,
      experienceEntries: Array.isArray(profile.experienceEntries) ? profile.experienceEntries : defaults.profile.experienceEntries,
      educationEntries: Array.isArray(profile.educationEntries) ? profile.educationEntries : defaults.profile.educationEntries,
      resumeTemplate: profile.resumeTemplate ?? defaults.profile.resumeTemplate,
      resumeStoragePath: typeof profile.resumeStoragePath === "string" ? profile.resumeStoragePath : defaults.profile.resumeStoragePath,
    },
    theme: payload.theme === "dark" ? "dark" : "light",
    user: storedUser,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.displayName === "string"
  );
}
