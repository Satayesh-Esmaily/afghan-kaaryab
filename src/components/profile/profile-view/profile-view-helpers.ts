import { getProfileAttachmentAccessUrl } from "@/lib/profile-attachment-storage";
import type {
  AwardEntry,
  CertificationEntry,
  DocumentEntry,
  EducationEntry,
  ExperienceEntry,
} from "@/lib/app-state";
import type {
  AwardEntryFormValues,
  CertificationEntryFormValues,
  DocumentEntryFormValues,
  EducationEntryFormValues,
  ExperienceEntryFormValues,
  ProfileFormValues,
} from "@/lib/schemas";

export function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "U";

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function splitItems(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function removeDelimitedItem(value: string, itemToRemove: string) {
  return splitItems(value)
    .filter((item) => item.toLowerCase() !== itemToRemove.trim().toLowerCase())
    .join(", ");
}

export function getProfileCompletion(
  profile: ProfileFormValues & {
    experienceEntries?: ExperienceEntry[];
    educationEntries?: EducationEntry[];
    certificationEntries?: CertificationEntry[];
    awardEntries?: AwardEntry[];
    documentEntries?: DocumentEntry[];
  }
) {
  const fields: Array<keyof ProfileFormValues> = [
    "fullName",
    "headline",
    "avatarUrl",
    "phone",
    "country",
    "province",
    "nationality",
    "dateOfBirth",
    "gender",
    "address",
    "location",
    "summary",
    "skills",
    "languages",
    "documents",
    "portfolioUrl",
    "linkedinUrl",
    "githubUrl",
    "twitterUrl",
    "resumeUrl",
    "introVideoUrl",
  ];

  const filled = fields.filter((field) => profile[field].trim().length > 0).length;
  const structuredFilled =
    Number((profile.experienceEntries?.length ?? 0) > 0 || profile.experience.trim().length > 0) +
    Number((profile.educationEntries?.length ?? 0) > 0 || profile.education.trim().length > 0) +
    Number((profile.certificationEntries?.length ?? 0) > 0 || profile.certifications.trim().length > 0) +
    Number((profile.awardEntries?.length ?? 0) > 0 || profile.awards.trim().length > 0) +
    Number((profile.documentEntries?.length ?? 0) > 0 || profile.documents.trim().length > 0);
  const total = fields.length + 5;

  return Math.min(100, Math.round(((filled + structuredFilled) / total) * 100));
}

export function serializeExperienceEntries(entries: ExperienceEntry[]) {
  return entries
    .map((entry) =>
      [
        entry.position,
        entry.organization,
        entry.employmentType,
        formatDateRange(entry.startDate, entry.endDate, entry.currentlyWorking),
        [entry.country, entry.province].filter(Boolean).join(", "),
        entry.skills,
        entry.description,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

export function serializeEducationEntries(entries: EducationEntry[]) {
  return entries
    .map((entry) =>
      [
        entry.degree,
        entry.institution,
        entry.fieldOfStudy,
        formatDateRange(entry.startDate, entry.endDate, false),
        [entry.country, entry.province].filter(Boolean).join(", "),
        entry.description,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

export function serializeCertificationEntries(entries: CertificationEntry[]) {
  return entries
    .map((entry) =>
      [
        entry.title,
        entry.issuingOrganization,
        entry.issueDate,
        entry.expirationDate,
        entry.credentialId,
        entry.certificationUrl,
        entry.description,
        entry.attachmentFileName,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

export function serializeAwardEntries(entries: AwardEntry[]) {
  return entries
    .map((entry) =>
      [entry.title, entry.issuedBy, entry.date, entry.referenceUrl, entry.description, entry.attachmentFileName]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

export function serializeDocumentEntries(entries: DocumentEntry[]) {
  return entries
    .map((entry) => [entry.title, entry.documentType, entry.description, entry.attachmentFileName].filter(Boolean).join("\n"))
    .join("\n\n");
}

export function mapExperienceEntryToForm(entry: ExperienceEntry | null): ExperienceEntryFormValues | null {
  if (!entry) return null;

  return {
    position: entry.position,
    organization: entry.organization,
    employmentType: entry.employmentType,
    currentlyWorking: entry.currentlyWorking,
    startDate: entry.startDate,
    endDate: entry.endDate,
    country: entry.country,
    province: entry.province,
    skills: entry.skills,
    description: entry.description,
  };
}

export function mapEducationEntryToForm(entry: EducationEntry | null): EducationEntryFormValues | null {
  if (!entry) return null;

  return {
    degree: entry.degree,
    institution: entry.institution,
    fieldOfStudy: entry.fieldOfStudy,
    country: entry.country,
    province: entry.province,
    startDate: entry.startDate,
    endDate: entry.endDate,
    description: entry.description,
  };
}

export function mapCertificationEntryToForm(entry: CertificationEntry | null): CertificationEntryFormValues | null {
  if (!entry) return null;

  return {
    title: entry.title,
    certificationUrl: entry.certificationUrl,
    credentialId: entry.credentialId,
    issuingOrganization: entry.issuingOrganization,
    issueDate: entry.issueDate,
    expirationDate: entry.expirationDate,
    description: entry.description,
    attachmentUrl: entry.attachmentUrl,
    attachmentStoragePath: entry.attachmentStoragePath,
    attachmentFileName: entry.attachmentFileName,
  };
}

export function mapAwardEntryToForm(entry: AwardEntry | null): AwardEntryFormValues | null {
  if (!entry) return null;

  return {
    title: entry.title,
    issuedBy: entry.issuedBy,
    date: entry.date,
    description: entry.description,
    referenceUrl: entry.referenceUrl,
    attachmentUrl: entry.attachmentUrl,
    attachmentStoragePath: entry.attachmentStoragePath,
    attachmentFileName: entry.attachmentFileName,
  };
}

export function mapDocumentEntryToForm(entry: DocumentEntry | null): DocumentEntryFormValues | null {
  if (!entry) return null;

  return {
    title: entry.title,
    documentType: entry.documentType,
    description: entry.description,
    attachmentUrl: entry.attachmentUrl,
    attachmentStoragePath: entry.attachmentStoragePath,
    attachmentFileName: entry.attachmentFileName,
  };
}

export function mapExperienceFormToEntry(values: ExperienceEntryFormValues, id?: string): ExperienceEntry {
  return {
    id: id ?? createEntryId(),
    position: values.position.trim(),
    organization: values.organization.trim(),
    employmentType: values.employmentType.trim(),
    currentlyWorking: values.currentlyWorking,
    startDate: values.startDate.trim(),
    endDate: values.currentlyWorking ? "" : values.endDate.trim(),
    country: values.country.trim(),
    province: values.province.trim(),
    skills: values.skills.trim(),
    description: values.description.trim(),
  };
}

export function mapEducationFormToEntry(values: EducationEntryFormValues, id?: string): EducationEntry {
  return {
    id: id ?? createEntryId(),
    degree: values.degree.trim(),
    institution: values.institution.trim(),
    fieldOfStudy: values.fieldOfStudy.trim(),
    country: values.country.trim(),
    province: values.province.trim(),
    startDate: values.startDate.trim(),
    endDate: values.endDate.trim(),
    description: values.description.trim(),
  };
}

export function mapCertificationFormToEntry(values: CertificationEntryFormValues, id?: string): CertificationEntry {
  return {
    id: id ?? createEntryId(),
    title: values.title.trim(),
    certificationUrl: values.certificationUrl.trim(),
    credentialId: values.credentialId.trim(),
    issuingOrganization: values.issuingOrganization.trim(),
    issueDate: values.issueDate.trim(),
    expirationDate: values.expirationDate.trim(),
    description: values.description.trim(),
    attachmentUrl: values.attachmentUrl.trim(),
    attachmentStoragePath: values.attachmentStoragePath.trim(),
    attachmentFileName: values.attachmentFileName.trim(),
  };
}

export function mapAwardFormToEntry(values: AwardEntryFormValues, id?: string): AwardEntry {
  return {
    id: id ?? createEntryId(),
    title: values.title.trim(),
    issuedBy: values.issuedBy.trim(),
    date: values.date.trim(),
    description: values.description.trim(),
    referenceUrl: values.referenceUrl.trim(),
    attachmentUrl: values.attachmentUrl.trim(),
    attachmentStoragePath: values.attachmentStoragePath.trim(),
    attachmentFileName: values.attachmentFileName.trim(),
  };
}

export function mapDocumentFormToEntry(values: DocumentEntryFormValues, id?: string): DocumentEntry {
  return {
    id: id ?? createEntryId(),
    title: values.title.trim(),
    documentType: values.documentType.trim(),
    description: values.description.trim(),
    attachmentUrl: values.attachmentUrl.trim(),
    attachmentStoragePath: values.attachmentStoragePath.trim(),
    attachmentFileName: values.attachmentFileName.trim(),
  };
}

export function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatDateRange(startDate: string, endDate: string, currentlyWorking: boolean) {
  return formatDateRangeLocalized(startDate, endDate, currentlyWorking, "en", "Present", "Date not added");
}

export function formatDateRangeLocalized(
  startDate: string,
  endDate: string,
  currentlyWorking: boolean,
  locale: string,
  presentLabel: string,
  missingLabel: string
) {
  const startLabel = formatDateLabel(startDate, locale);
  const endLabel = currentlyWorking ? presentLabel : formatDateLabel(endDate, locale);

  if (startLabel && endLabel) {
    return `${startLabel} - ${endLabel}`;
  }

  return startLabel || endLabel || missingLabel;
}

export function formatDateLabel(value: string, locale = "en") {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getFileNameFromUrl(value: string) {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    const fileName = parts.at(-1);
    if (!fileName) {
      return "resume";
    }

    return decodeURIComponent(fileName);
  } catch {
    return value.split("/").filter(Boolean).at(-1) ?? "resume";
  }
}

export function getFileNameFromPath(value: string) {
  const parts = value.split("/").filter(Boolean);
  const fileName = parts.at(-1);
  if (!fileName) {
    return "resume";
  }

  return decodeURIComponent(fileName);
}

export async function resolveAttachmentEntryUrls<T extends { attachmentStoragePath: string; attachmentUrl: string }>(
  entries: T[]
) {
  let changed = false;
  const resolved = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.attachmentStoragePath || entry.attachmentUrl) {
        return entry;
      }

      const nextUrl = await getProfileAttachmentAccessUrl(entry.attachmentStoragePath);
      if (!nextUrl) {
        return entry;
      }

      changed = true;
      return {
        ...entry,
        attachmentUrl: nextUrl,
      };
    })
  );

  return changed ? resolved : entries;
}
