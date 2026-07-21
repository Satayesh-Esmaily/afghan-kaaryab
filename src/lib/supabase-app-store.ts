import { demoOpportunities } from "@/data/opportunities";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  AwardEntry,
  CertificationEntry,
  DocumentEntry,
  EducationEntry,
  ExperienceEntry,
  JobSeekerProfile,
  ThemeMode,
  AuthUser,
} from "@/lib/app-state";
import type { Opportunity } from "@/lib/opportunities";
import { createDefaultProfile } from "@/lib/app-state";

type SupabaseBrowserClient = NonNullable<ReturnType<typeof getSupabaseBrowserClient>>;

type DbProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  avatar_storage_path: string | null;
  resume_url: string | null;
  resume_storage_path: string | null;
  country: string | null;
  province: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  summary: string | null;
  skills: string | null;
  experience: string | null;
  education: string | null;
  certifications: string | null;
  awards: string | null;
  languages: string | null;
  documents: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  intro_video_url: string | null;
  location: string | null;
  phone: string | null;
  bio: string | null;
  resume_template: JobSeekerProfile["resumeTemplate"] | null;
  theme_mode: ThemeMode | null;
};

type DbExperienceRow = {
  id: string;
  profile_id: string;
  position: string;
  organization: string;
  employment_type: string;
  currently_working: boolean;
  start_date: string;
  end_date: string | null;
  country: string;
  province: string;
  skills: string;
  description: string;
};

type DbEducationRow = {
  id: string;
  profile_id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  country: string;
  province: string;
  start_date: string;
  end_date: string | null;
  description: string;
};

type DbCertificationRow = {
  id: string;
  profile_id: string;
  title: string;
  certification_url: string | null;
  credential_id: string | null;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
  description: string;
  attachment_url: string;
  attachment_storage_path: string;
  attachment_file_name: string;
};

type DbAwardRow = {
  id: string;
  profile_id: string;
  title: string;
  issued_by: string;
  date: string;
  description: string;
  reference_url: string | null;
  attachment_url: string;
  attachment_storage_path: string;
  attachment_file_name: string;
};

type DbDocumentRow = {
  id: string;
  profile_id: string;
  title: string;
  document_type: string;
  description: string;
  attachment_url: string;
  attachment_storage_path: string;
  attachment_file_name: string;
};

type DbOpportunityRow = {
  id: string;
  title: string;
  organization: string;
  category: Opportunity["category"];
  location: string;
  type: Opportunity["type"];
  published_at: string | null;
  gender: Opportunity["gender"] | null;
  level: Opportunity["level"] | null;
  deadline: string;
  description: string;
  responsibilities: string[] | null;
  requirements: string[] | null;
  skills: string[] | null;
  documents_required: string[] | null;
  company_summary: string | null;
  apply_link: string;
  tags: string[] | null;
  featured: boolean | null;
  submitted_at: string | null;
  user_id: string | null;
};

export type LoadedAppStore = {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
  profile: JobSeekerProfile;
  theme: ThemeMode;
};

export async function loadAppStore(user: AuthUser | null): Promise<LoadedAppStore> {
  const supabase = getSupabaseBrowserClient();
  const defaultProfile = createDefaultProfile(user);

  if (!supabase) {
    return createFallbackAppStore(defaultProfile);
  }

  return loadAppStoreFromSupabase(supabase, user);
}

export async function loadAppStoreFromSupabase(
  supabase: SupabaseClient,
  user: AuthUser | null
): Promise<LoadedAppStore> {
  const defaultProfile = createDefaultProfile(user);

  const [opportunitiesResult, profileResult, savedResult, followedResult] = await Promise.all([
    supabase
      .from("opportunities")
      .select("*")
      .order("submitted_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    user?.id
      ? supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    user?.id
      ? supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", user.id)
      : Promise.resolve({ data: [], error: null }),
    user?.id
      ? supabase.from("followed_organizations").select("organization_slug").eq("user_id", user.id)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const opportunities = Array.isArray(opportunitiesResult.data) && opportunitiesResult.data.length > 0
    ? opportunitiesResult.data.map(mapOpportunityRowToOpportunity)
    : demoOpportunities;

  const savedIds = Array.isArray(savedResult.data)
    ? savedResult.data.map((row) => row.opportunity_id).filter(Boolean)
    : [];
  const followedOrganizationSlugs = Array.isArray(followedResult.data)
    ? followedResult.data.map((row) => row.organization_slug).filter(Boolean)
    : [];

  let profileRow = profileResult.data as DbProfileRow | null;

  if (user?.id && !profileRow) {
    const inserted = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: user.displayName,
          headline: defaultProfile.headline,
          avatar_url: defaultProfile.avatarUrl,
          avatar_storage_path: defaultProfile.avatarStoragePath,
          resume_url: defaultProfile.resumeUrl,
          resume_storage_path: defaultProfile.resumeStoragePath,
          country: defaultProfile.country,
          province: defaultProfile.province,
          nationality: defaultProfile.nationality,
          date_of_birth: defaultProfile.dateOfBirth || null,
          gender: defaultProfile.gender,
          address: defaultProfile.address,
          summary: defaultProfile.summary,
          skills: defaultProfile.skills,
          experience: defaultProfile.experience,
          education: defaultProfile.education,
          certifications: defaultProfile.certifications,
          awards: defaultProfile.awards,
          languages: defaultProfile.languages,
          documents: defaultProfile.documents,
          portfolio_url: defaultProfile.portfolioUrl,
          linkedin_url: defaultProfile.linkedinUrl,
          github_url: defaultProfile.githubUrl,
          twitter_url: defaultProfile.twitterUrl,
          intro_video_url: defaultProfile.introVideoUrl,
          location: defaultProfile.location,
          phone: defaultProfile.phone,
          bio: defaultProfile.bio,
          resume_template: defaultProfile.resumeTemplate,
          theme_mode: "light",
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (!inserted.error && inserted.data) {
      profileRow = inserted.data as DbProfileRow;
    }
  }

  const profileId = profileRow?.id ?? null;

  const [experienceResult, educationResult, certificationResult, awardResult, documentResult] = profileId
    ? await Promise.all([
        supabase.from("experience_entries").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
        supabase.from("education_entries").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
        supabase.from("certification_entries").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
        supabase.from("award_entries").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
        supabase.from("document_entries").select("*").eq("profile_id", profileId).order("created_at", { ascending: true }),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
      ];

  const profile = mapProfileRowToProfile(profileRow, {
    experienceEntries: Array.isArray(experienceResult.data) ? experienceResult.data.map(mapExperienceRow) : [],
    educationEntries: Array.isArray(educationResult.data) ? educationResult.data.map(mapEducationRow) : [],
    certificationEntries: Array.isArray(certificationResult.data)
      ? certificationResult.data.map(mapCertificationRow)
      : [],
    awardEntries: Array.isArray(awardResult.data) ? awardResult.data.map(mapAwardRow) : [],
    documentEntries: Array.isArray(documentResult.data) ? documentResult.data.map(mapDocumentRow) : [],
    fallbackUser: user,
  });

  return {
    opportunities,
    savedIds,
    followedOrganizationSlugs,
    profile,
    theme: profileRow?.theme_mode === "dark" ? "dark" : "light",
  };
}

function createFallbackAppStore(profile: JobSeekerProfile): LoadedAppStore {
  return {
    opportunities: demoOpportunities,
    savedIds: [],
    followedOrganizationSlugs: [],
    profile,
    theme: "light",
  };
}

export async function saveProfileStore(userId: string, profile: JobSeekerProfile, theme: ThemeMode) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || !userId) return;

  const existing = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  const profileId = (existing.data as DbProfileRow | null)?.id;

  const profileRow = {
    user_id: userId,
    full_name: profile.fullName,
    headline: profile.headline,
    avatar_url: profile.avatarUrl,
    avatar_storage_path: profile.avatarStoragePath,
    resume_url: profile.resumeUrl,
    resume_storage_path: profile.resumeStoragePath,
    country: profile.country,
    province: profile.province,
    nationality: profile.nationality,
    date_of_birth: profile.dateOfBirth || null,
    gender: profile.gender,
    address: profile.address,
    summary: profile.summary,
    skills: profile.skills,
    experience: profile.experience,
    education: profile.education,
    certifications: profile.certifications,
    awards: profile.awards,
    languages: profile.languages,
    documents: profile.documents,
    portfolio_url: profile.portfolioUrl,
    linkedin_url: profile.linkedinUrl,
    github_url: profile.githubUrl,
    twitter_url: profile.twitterUrl,
    intro_video_url: profile.introVideoUrl,
    location: profile.location,
    phone: profile.phone,
    bio: profile.bio,
    resume_template: profile.resumeTemplate,
    theme_mode: theme,
  };

  const profileUpsert = await supabase.from("profiles").upsert(profileRow, { onConflict: "user_id" }).select("*").single();
  const savedProfile = (profileUpsert.data as DbProfileRow | null) ?? (existing.data as DbProfileRow | null);
  const nextProfileId = savedProfile?.id ?? profileId;

  if (!nextProfileId) {
    return;
  }

  await syncChildTable(supabase, "experience_entries", nextProfileId, profile.experienceEntries, mapExperienceEntryToRow);
  await syncChildTable(supabase, "education_entries", nextProfileId, profile.educationEntries, mapEducationEntryToRow);
  await syncChildTable(
    supabase,
    "certification_entries",
    nextProfileId,
    profile.certificationEntries,
    mapCertificationEntryToRow
  );
  await syncChildTable(supabase, "award_entries", nextProfileId, profile.awardEntries, mapAwardEntryToRow);
  await syncChildTable(supabase, "document_entries", nextProfileId, profile.documentEntries, mapDocumentEntryToRow);
}

export async function saveOpportunityStore(opportunity: Opportunity, userId: string | null) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const row = mapOpportunityToRow(opportunity, userId);
  await supabase.from("opportunities").upsert(row, { onConflict: "id" });
}

export async function deleteOpportunityStore(opportunityId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  await supabase.from("opportunities").delete().eq("id", opportunityId);
}

export async function setSavedOpportunity(userId: string, opportunityId: string, saved: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  if (saved) {
    await supabase.from("saved_opportunities").upsert({ user_id: userId, opportunity_id: opportunityId });
    return;
  }

  await supabase.from("saved_opportunities").delete().match({ user_id: userId, opportunity_id: opportunityId });
}

export async function clearSavedOpportunitiesStore(userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || !userId) return;

  await supabase.from("saved_opportunities").delete().eq("user_id", userId);
}

export async function setFollowedOrganization(userId: string, organizationSlug: string, followed: boolean) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  if (followed) {
    await supabase.from("followed_organizations").upsert({ user_id: userId, organization_slug: organizationSlug });
    return;
  }

  await supabase.from("followed_organizations").delete().match({ user_id: userId, organization_slug: organizationSlug });
}

function mapOpportunityRowToOpportunity(row: DbOpportunityRow): Opportunity {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    category: row.category,
    location: row.location,
    type: row.type,
    publishedAt: row.published_at ?? undefined,
    gender: row.gender ?? undefined,
    level: row.level ?? undefined,
    deadline: row.deadline,
    description: row.description,
    responsibilities: row.responsibilities ?? undefined,
    requirements: row.requirements ?? [],
    skills: row.skills ?? undefined,
    documentsRequired: row.documents_required ?? undefined,
    companySummary: row.company_summary ?? undefined,
    applyLink: row.apply_link,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    submittedAt: row.submitted_at ?? undefined,
  };
}

function mapOpportunityToRow(opportunity: Opportunity, userId: string | null): DbOpportunityRow {
  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    category: opportunity.category,
    location: opportunity.location,
    type: opportunity.type,
    published_at: opportunity.publishedAt ?? null,
    gender: opportunity.gender ?? null,
    level: opportunity.level ?? null,
    deadline: opportunity.deadline,
    description: opportunity.description,
    responsibilities: opportunity.responsibilities ?? null,
    requirements: opportunity.requirements ?? [],
    skills: opportunity.skills ?? null,
    documents_required: opportunity.documentsRequired ?? null,
    company_summary: opportunity.companySummary ?? null,
    apply_link: opportunity.applyLink,
    tags: opportunity.tags ?? [],
    featured: opportunity.featured ?? false,
    submitted_at: opportunity.submittedAt ?? null,
    user_id: userId,
  };
}

function mapProfileRowToProfile(
  row: DbProfileRow | null,
  children: {
    experienceEntries: ExperienceEntry[];
    educationEntries: EducationEntry[];
    certificationEntries: CertificationEntry[];
    awardEntries: AwardEntry[];
    documentEntries: DocumentEntry[];
    fallbackUser: AuthUser | null;
  }
): JobSeekerProfile {
  const fallback = createDefaultProfile(children.fallbackUser);

  if (!row) {
    return {
      ...fallback,
      experienceEntries: children.experienceEntries,
      educationEntries: children.educationEntries,
      certificationEntries: children.certificationEntries,
      awardEntries: children.awardEntries,
      documentEntries: children.documentEntries,
      experience: serializeDelimited(children.experienceEntries.map((item) => item.position)),
      education: serializeDelimited(children.educationEntries.map((item) => item.degree)),
      certifications: serializeDelimited(children.certificationEntries.map((item) => item.title)),
      awards: serializeDelimited(children.awardEntries.map((item) => item.title)),
      documents: serializeDelimited(children.documentEntries.map((item) => item.title)),
    };
  }

  return {
    ...fallback,
    fullName: row.full_name ?? fallback.fullName,
    headline: row.headline ?? fallback.headline,
    avatarUrl: row.avatar_url ?? fallback.avatarUrl,
    avatarStoragePath: row.avatar_storage_path ?? fallback.avatarStoragePath,
    resumeUrl: row.resume_url ?? fallback.resumeUrl,
    resumeStoragePath: row.resume_storage_path ?? fallback.resumeStoragePath,
    country: row.country ?? fallback.country,
    province: row.province ?? fallback.province,
    nationality: row.nationality ?? fallback.nationality,
    dateOfBirth: row.date_of_birth ?? fallback.dateOfBirth,
    gender: row.gender ?? fallback.gender,
    address: row.address ?? fallback.address,
    summary: row.summary ?? fallback.summary,
    skills: row.skills ?? fallback.skills,
    experience: row.experience ?? fallback.experience,
    education: row.education ?? fallback.education,
    certifications: row.certifications ?? fallback.certifications,
    awards: row.awards ?? fallback.awards,
    languages: row.languages ?? fallback.languages,
    documents: row.documents ?? fallback.documents,
    portfolioUrl: row.portfolio_url ?? fallback.portfolioUrl,
    linkedinUrl: row.linkedin_url ?? fallback.linkedinUrl,
    githubUrl: row.github_url ?? fallback.githubUrl,
    twitterUrl: row.twitter_url ?? fallback.twitterUrl,
    introVideoUrl: row.intro_video_url ?? fallback.introVideoUrl,
    location: row.location ?? fallback.location,
    phone: row.phone ?? fallback.phone,
    bio: row.bio ?? fallback.bio,
    resumeTemplate: row.resume_template ?? fallback.resumeTemplate,
    experienceEntries: children.experienceEntries,
    educationEntries: children.educationEntries,
    certificationEntries: children.certificationEntries,
    awardEntries: children.awardEntries,
    documentEntries: children.documentEntries,
  };
}

function mapExperienceRow(row: DbExperienceRow): ExperienceEntry {
  return {
    id: row.id,
    position: row.position,
    organization: row.organization,
    employmentType: row.employment_type,
    currentlyWorking: row.currently_working,
    startDate: row.start_date,
    endDate: row.end_date ?? "",
    country: row.country,
    province: row.province,
    skills: row.skills,
    description: row.description,
  };
}

function mapEducationRow(row: DbEducationRow): EducationEntry {
  return {
    id: row.id,
    degree: row.degree,
    institution: row.institution,
    fieldOfStudy: row.field_of_study,
    country: row.country,
    province: row.province,
    startDate: row.start_date,
    endDate: row.end_date ?? "",
    description: row.description,
  };
}

function mapCertificationRow(row: DbCertificationRow): CertificationEntry {
  return {
    id: row.id,
    title: row.title,
    certificationUrl: row.certification_url ?? "",
    credentialId: row.credential_id ?? "",
    issuingOrganization: row.issuing_organization,
    issueDate: row.issue_date,
    expirationDate: row.expiration_date ?? "",
    description: row.description,
    attachmentUrl: row.attachment_url,
    attachmentStoragePath: row.attachment_storage_path,
    attachmentFileName: row.attachment_file_name,
  };
}

function mapAwardRow(row: DbAwardRow): AwardEntry {
  return {
    id: row.id,
    title: row.title,
    issuedBy: row.issued_by,
    date: row.date,
    description: row.description,
    referenceUrl: row.reference_url ?? "",
    attachmentUrl: row.attachment_url,
    attachmentStoragePath: row.attachment_storage_path,
    attachmentFileName: row.attachment_file_name,
  };
}

function mapDocumentRow(row: DbDocumentRow): DocumentEntry {
  return {
    id: row.id,
    title: row.title,
    documentType: row.document_type,
    description: row.description,
    attachmentUrl: row.attachment_url,
    attachmentStoragePath: row.attachment_storage_path,
    attachmentFileName: row.attachment_file_name,
  };
}

function mapExperienceEntryToRow(entry: ExperienceEntry, profileId: string) {
  return {
    profile_id: profileId,
    id: entry.id,
    position: entry.position,
    organization: entry.organization,
    employment_type: entry.employmentType,
    currently_working: entry.currentlyWorking,
    start_date: entry.startDate,
    end_date: entry.endDate || null,
    country: entry.country,
    province: entry.province,
    skills: entry.skills,
    description: entry.description,
  };
}

function mapEducationEntryToRow(entry: EducationEntry, profileId: string) {
  return {
    profile_id: profileId,
    id: entry.id,
    degree: entry.degree,
    institution: entry.institution,
    field_of_study: entry.fieldOfStudy,
    country: entry.country,
    province: entry.province,
    start_date: entry.startDate,
    end_date: entry.endDate || null,
    description: entry.description,
  };
}

function mapCertificationEntryToRow(entry: CertificationEntry, profileId: string) {
  return {
    profile_id: profileId,
    id: entry.id,
    title: entry.title,
    certification_url: entry.certificationUrl,
    credential_id: entry.credentialId,
    issuing_organization: entry.issuingOrganization,
    issue_date: entry.issueDate,
    expiration_date: entry.expirationDate || null,
    description: entry.description,
    attachment_url: entry.attachmentUrl,
    attachment_storage_path: entry.attachmentStoragePath,
    attachment_file_name: entry.attachmentFileName,
  };
}

function mapAwardEntryToRow(entry: AwardEntry, profileId: string) {
  return {
    profile_id: profileId,
    id: entry.id,
    title: entry.title,
    issued_by: entry.issuedBy,
    date: entry.date,
    description: entry.description,
    reference_url: entry.referenceUrl || null,
    attachment_url: entry.attachmentUrl,
    attachment_storage_path: entry.attachmentStoragePath,
    attachment_file_name: entry.attachmentFileName,
  };
}

function mapDocumentEntryToRow(entry: DocumentEntry, profileId: string) {
  return {
    profile_id: profileId,
    id: entry.id,
    title: entry.title,
    document_type: entry.documentType,
    description: entry.description,
    attachment_url: entry.attachmentUrl,
    attachment_storage_path: entry.attachmentStoragePath,
    attachment_file_name: entry.attachmentFileName,
  };
}

async function syncChildTable<T>(
  supabase: SupabaseBrowserClient,
  tableName: "experience_entries" | "education_entries" | "certification_entries" | "award_entries" | "document_entries",
  profileId: string,
  entries: T[],
  mapEntry: (entry: T, profileId: string) => Record<string, unknown>
) {
  await supabase.from(tableName).delete().eq("profile_id", profileId);

  if (entries.length === 0) {
    return;
  }

  await supabase.from(tableName).insert(entries.map((entry) => mapEntry(entry, profileId)));
}

function serializeDelimited(values: string[]) {
  return values.filter(Boolean).join(", ");
}
