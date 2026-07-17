"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, EmptyState } from "@/components/ui";
import FormField from "@/components/common/FormField";
import DatePickerField from "@/components/common/DatePickerField";
import SearchableSelect from "@/components/common/SearchableSelect";
import { authCopy } from "@/config/auth";
import {
  AwardEntryDialog,
  CertificationEntryDialog,
  EducationEntryDialog,
  ExperienceEntryDialog,
  DocumentEntryDialog,
} from "@/components/profile/ProfileEntryDialog";
import { useAppData } from "@/context/app-context";
import { getAvatarAccessUrl, uploadAvatarFile } from "@/lib/avatar-storage";
import { getProfileAttachmentAccessUrl } from "@/lib/profile-attachment-storage";
import { deleteResumeFile, getResumeAccessUrl, uploadResumeFile } from "@/lib/resume-storage";
import { deleteProfileAttachment } from "@/lib/profile-attachment-storage";
import { countryOptions, genderOptions, nationalityOptions } from "@/data/profile-options";
import type {
  AwardEntry,
  CertificationEntry,
  EducationEntry,
  DocumentEntry,
  ExperienceEntry,
} from "@/lib/app-state";
import {
  type AwardEntryFormValues,
  type CertificationEntryFormValues,
  type DocumentEntryFormValues,
  profileFormSchema,
  type EducationEntryFormValues,
  type ExperienceEntryFormValues,
  type ProfileFormValues,
} from "@/lib/schemas";

type ProfileTabId = "information" | "resume" | "interview";

const profileTabs: Array<{
  id: ProfileTabId;
  label: string;
  disabled?: boolean;
}> = [
  { id: "information", label: "Profile Information" },
  { id: "resume", label: "Resume" },
  { id: "interview", label: "AI Interview (Coming Soon)", disabled: true },
];

export default function ProfileView() {
  const searchParams = useSearchParams();
  const { authenticated, profile, updateProfile, user } = useAppData();
  const [activeTab, setActiveTab] = useState<ProfileTabId>("information");
  const [resumeFiles, setResumeFiles] = useState<string[]>([]);
  const [resumeUploadError, setResumeUploadError] = useState<string>("");
  const [resumeUploadBusy, setResumeUploadBusy] = useState(false);
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>(
    Array.isArray(profile.certificationEntries) ? profile.certificationEntries : []
  );
  const [awardEntries, setAwardEntries] = useState<AwardEntry[]>(
    Array.isArray(profile.awardEntries) ? profile.awardEntries : []
  );
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>(
    Array.isArray(profile.documentEntries) ? profile.documentEntries : []
  );
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>(
    Array.isArray(profile.experienceEntries) ? profile.experienceEntries : []
  );
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    Array.isArray(profile.educationEntries) ? profile.educationEntries : []
  );
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<number | null>(null);
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [editingDocumentIndex, setEditingDocumentIndex] = useState<number | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
    values: profile,
  });

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);
  const initials = useMemo(() => getInitials(profile.fullName), [profile.fullName]);
  const skills = useMemo(() => splitItems(profile.skills), [profile.skills]);
  const languages = useMemo(() => splitItems(profile.languages), [profile.languages]);
  const showWelcome = searchParams.get("status") === "welcome";
  const selectedCountry = watch("country");
  const selectedNationality = watch("nationality");
  const selectedGender = watch("gender");
  const selectedDateOfBirth = watch("dateOfBirth");
  useEffect(() => {
    setValue("documents", serializeDocumentEntries(documentEntries), {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [documentEntries, setValue]);
  const removeSkill = (skillToRemove: string) => {
    updateProfile({ skills: removeDelimitedItem(profile.skills, skillToRemove) });
  };
  const removeLanguage = (languageToRemove: string) => {
    updateProfile({ languages: removeDelimitedItem(profile.languages, languageToRemove) });
  };

  useEffect(() => {
    setExperienceEntries(Array.isArray(profile.experienceEntries) ? profile.experienceEntries : []);
  }, [profile.experienceEntries]);

  useEffect(() => {
    setEducationEntries(Array.isArray(profile.educationEntries) ? profile.educationEntries : []);
  }, [profile.educationEntries]);

  useEffect(() => {
    setCertificationEntries(Array.isArray(profile.certificationEntries) ? profile.certificationEntries : []);
  }, [profile.certificationEntries]);

  useEffect(() => {
    setAwardEntries(Array.isArray(profile.awardEntries) ? profile.awardEntries : []);
  }, [profile.awardEntries]);

  useEffect(() => {
    setDocumentEntries(Array.isArray(profile.documentEntries) ? profile.documentEntries : []);
  }, [profile.documentEntries]);

  useEffect(() => {
    if (profile.resumeStoragePath) {
      setResumeFiles([getFileNameFromPath(profile.resumeStoragePath)]);
      return;
    }

    if (profile.resumeUrl) {
      setResumeFiles([getFileNameFromUrl(profile.resumeUrl)]);
      return;
    }

    setResumeFiles([]);
  }, [profile.resumeStoragePath, profile.resumeUrl]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAvatarUrl() {
      if (!profile.avatarStoragePath) {
        return;
      }

      const nextUrl = await getAvatarAccessUrl(profile.avatarStoragePath);
      if (cancelled || !nextUrl) {
        return;
      }

      if (nextUrl !== profile.avatarUrl) {
        updateProfile({ avatarUrl: nextUrl });
      }
    }

    void refreshAvatarUrl();

    return () => {
      cancelled = true;
    };
  }, [profile.avatarStoragePath, profile.avatarUrl, updateProfile]);

  useEffect(() => {
    let cancelled = false;

    async function refreshResumeUrl() {
      if (!profile.resumeStoragePath) {
        return;
      }

      const nextUrl = await getResumeAccessUrl(profile.resumeStoragePath);
      if (cancelled || !nextUrl) {
        return;
      }

      if (nextUrl !== profile.resumeUrl) {
        updateProfile({ resumeUrl: nextUrl });
      }
    }

    void refreshResumeUrl();

    return () => {
      cancelled = true;
    };
  }, [profile.resumeStoragePath, profile.resumeUrl, updateProfile]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAttachmentUrls() {
      const [certificationEntries, awardEntries, documentEntries] = await Promise.all([
        resolveAttachmentEntryUrls(profile.certificationEntries),
        resolveAttachmentEntryUrls(profile.awardEntries),
        resolveAttachmentEntryUrls(profile.documentEntries),
      ]);

      if (cancelled) {
        return;
      }

      if (certificationEntries !== profile.certificationEntries) {
        updateProfile({
          certificationEntries,
          certifications: serializeCertificationEntries(certificationEntries),
        });
      }

      if (awardEntries !== profile.awardEntries) {
        updateProfile({
          awardEntries,
          awards: serializeAwardEntries(awardEntries),
        });
      }

      if (documentEntries !== profile.documentEntries) {
        updateProfile({
          documentEntries,
          documents: serializeDocumentEntries(documentEntries),
        });
      }
    }

    void refreshAttachmentUrls();

    return () => {
      cancelled = true;
    };
  }, [profile.awardEntries, profile.certificationEntries, profile.documentEntries, updateProfile]);

  if (!authenticated) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Your resume, skills, and job-seeking details are available after login."
        actionHref="/login"
        actionLabel={authCopy.loginButtonLabel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {showWelcome ? (
        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-sm sm:px-6">
          <p className="text-sm font-semibold text-[color:var(--foreground-strong)]">
            {authCopy.signupSuccessTitle}
          </p>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
            {authCopy.signupSuccessMessage}
          </p>
        </div>
      ) : null}

      <div className="rounded-[1.5rem] panel px-5 py-4 text-lg font-semibold text-[color:var(--foreground)] sm:px-6">
        Profile
      </div>

      <section className="rounded-[1.75rem] panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[color:var(--accent-soft)] bg-[color:var(--surface-soft)] text-2xl font-semibold text-[color:var(--foreground-strong)] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName || "Profile photo"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="text-base font-medium leading-7 text-[color:var(--foreground)] sm:text-lg">
                Complete your profile to build a resume that stands out to employers
              </p>
              <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">
                Keep your personal details, experience, and links up to date for better matches.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end lg:gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
              {completion}%
            </span>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-[color:var(--surface-soft)] sm:w-56">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--success))]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto border-b border-[color:var(--border)] pb-2 text-sm">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "whitespace-nowrap rounded-full px-4 py-2 font-medium transition",
              activeTab === tab.id
                ? "bg-[color:var(--surface)] text-[color:var(--foreground-strong)] shadow-sm"
                : "text-[color:var(--foreground-muted)] hover:text-[color:var(--foreground)]",
              tab.disabled ? "cursor-not-allowed opacity-55" : "",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "resume" ? (
        <ResumeTab
          resumeInputRef={resumeInputRef}
          resumeFiles={resumeFiles}
          resumeUploadBusy={resumeUploadBusy}
          resumeUploadError={resumeUploadError}
          onPickFiles={() => resumeInputRef.current?.click()}
          onFilesChange={async (files) => {
            setResumeUploadError("");

            if (files.length === 0) {
              return;
            }

            setResumeUploadBusy(true);

            try {
              const userId = user?.id ?? null;

              if (!userId) {
                setResumeUploadError("You need to be signed in to upload a resume.");
                return;
              }

              const uploadedItems: Awaited<ReturnType<typeof uploadResumeFile>>[] = [];

              for (const file of files) {
                const result = await uploadResumeFile(file, userId);
                if (result) {
                  uploadedItems.unshift(result);
                }
              }

              const activeResume = uploadedItems[0];
              if (activeResume) {
                setResumeFiles([activeResume.fileName]);
                updateProfile({
                  resumeUrl: activeResume.url,
                  resumeStoragePath: activeResume.path,
                });
              }
            } catch {
              setResumeUploadError("We could not upload the file. Please try again.");
            } finally {
              setResumeUploadBusy(false);
            }
          }}
          onDeleteFile={async () => {
            if (!profile.resumeStoragePath) {
              setResumeFiles([]);
              updateProfile({ resumeUrl: "", resumeStoragePath: "" });
              return;
            }

            const deleted = await deleteResumeFile(profile.resumeStoragePath);
            if (deleted) {
              setResumeFiles([]);
              updateProfile({ resumeUrl: "", resumeStoragePath: "" });
            } else {
              setResumeUploadError("We could not delete the file right now.");
            }
          }}
          onDownloadFile={async () => {
            if (!profile.resumeStoragePath && !profile.resumeUrl) {
              return;
            }

            const url = profile.resumeStoragePath
              ? await getResumeAccessUrl(profile.resumeStoragePath)
              : profile.resumeUrl;

            if (!url) {
              setResumeUploadError("We could not generate a download link.");
              return;
            }

            window.open(url, "_blank", "noopener,noreferrer");
          }}
        />
      ) : (
        <form
          onSubmit={handleSubmit(async (values) => {
            updateProfile(values);
          })}
          className="space-y-6"
        >
          <ProfileSection title="Personal Details" description="Share your expertise and complete your profile.">
            <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
              <aside className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-soft)] text-3xl font-semibold text-[color:var(--foreground-strong)]">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName || "Profile photo"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      avatarInputRef.current?.click();
                    }}
                    className="ds-button-secondary rounded-full px-4 py-2.5 text-sm font-semibold"
                  >
                    Upload Photo
                  </button>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    void uploadAvatarFile(file, user?.id ?? "").then((result) => {
                      if (result) {
                        updateProfile({ avatarUrl: result.url, avatarStoragePath: result.path });
                      }
                    });
                    event.currentTarget.value = "";
                  }}
                />

                <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                    Profile completion
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground-strong)]">
                    {completion}%
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">
                    Fill the sections below to make your profile stronger for employers.
                  </p>
                </div>
              </aside>

              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Full Name" error={errors.fullName?.message}>
                    <input {...register("fullName")} className="ds-input" />
                  </FormField>
                  <FormField label="Professional Expertise" error={errors.headline?.message}>
                    <input {...register("headline")} className="ds-input" />
                  </FormField>
                  <FormField label="Contact Number" error={errors.phone?.message}>
                    <input {...register("phone")} className="ds-input" placeholder="+93 79 123 4567" />
                  </FormField>
                  <ProfileValueBox label="Email Address" value={user?.email ?? "Not available"} />
                  <FormField label="Country" error={errors.country?.message}>
                    <SearchableSelect
                      value={selectedCountry}
                      options={countryOptions}
                      placeholder="Select country"
                      searchPlaceholder="Search country..."
                      onChange={(value) =>
                        setValue("country", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormField>
                  <FormField label="Province" error={errors.province?.message}>
                    <input {...register("province")} className="ds-input" />
                  </FormField>
                  <FormField label="Nationality" error={errors.nationality?.message}>
                    <SearchableSelect
                      value={selectedNationality}
                      options={nationalityOptions}
                      placeholder="Select nationality"
                      searchPlaceholder="Search nationality..."
                      onChange={(value) =>
                        setValue("nationality", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormField>
                  <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
                    <DatePickerField
                      value={selectedDateOfBirth}
                      placeholder="Select date"
                      onChange={(value) =>
                        setValue("dateOfBirth", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormField>
                  <FormField label="Gender" error={errors.gender?.message}>
                    <SearchableSelect
                      value={selectedGender}
                      options={genderOptions}
                      placeholder="Select gender"
                      onChange={(value) =>
                        setValue("gender", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormField>
                  <FormField label="Current Address" error={errors.address?.message}>
                    <input {...register("address")} className="ds-input" placeholder="Taimani, Kabul, Afghanistan" />
                  </FormField>
                  <FormField label="Location" error={errors.location?.message}>
                    <input {...register("location")} className="ds-input" placeholder="Kabul" />
                  </FormField>
                  <FormField label="Avatar URL" error={errors.avatarUrl?.message}>
                    <input
                      id="avatarUrl"
                      {...register("avatarUrl")}
                      className="ds-input"
                      placeholder="https://..."
                    />
                  </FormField>
                </div>

                <FormField label="Professional Summary" error={errors.summary?.message}>
                  <textarea
                    {...register("summary")}
                    className="ds-input min-h-32"
                    placeholder="Introduce your background, experience, and strengths."
                  />
                </FormField>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection
            title="Work Experience"
            description="List your previous roles and responsibilities."
          >
            <EntriesHeader
              actionLabel="Add Experience"
              onAction={() => setEditingExperienceIndex(-1)}
            />

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {experienceEntries.length > 0 ? (
                experienceEntries.map((entry, index) => (
                  <ExperienceCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => setEditingExperienceIndex(index)}
                    onDelete={() => {
                      const next = experienceEntries.filter((_, itemIndex) => itemIndex !== index);
                      setExperienceEntries(next);
                      updateProfile({
                        experienceEntries: next,
                        experience: serializeExperienceEntries(next),
                      });
                    }}
                  />
                ))
              ) : (
                <EmptyListCard
                  title="No experience added yet"
                  description="Add your latest roles, companies, and responsibilities."
                  actionLabel="Add Experience"
                  onAction={() => setEditingExperienceIndex(-1)}
                />
              )}
            </div>
          </ProfileSection>

          <ProfileSection title="Education" description="Add your educational background.">
            <EntriesHeader actionLabel="Add Education" onAction={() => setEditingEducationIndex(-1)} />

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {educationEntries.length > 0 ? (
                educationEntries.map((entry, index) => (
                  <EducationCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => setEditingEducationIndex(index)}
                    onDelete={() => {
                      const next = educationEntries.filter((_, itemIndex) => itemIndex !== index);
                      setEducationEntries(next);
                      updateProfile({
                        educationEntries: next,
                        education: serializeEducationEntries(next),
                      });
                    }}
                  />
                ))
              ) : (
                <EmptyListCard
                  title="No education added yet"
                  description="Add your degrees, institutes, and field of study."
                  actionLabel="Add Education"
                  onAction={() => setEditingEducationIndex(-1)}
                />
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Certifications"
            description="Showcase certificates and credentials that strengthen your profile."
          >
            <EntriesHeader actionLabel="Add Certification" onAction={() => setEditingCertificationIndex(-1)} />

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {certificationEntries.length > 0 ? (
                certificationEntries.map((entry, index) => (
                  <CertificationCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => setEditingCertificationIndex(index)}
                    onDelete={async () => {
                      const next = certificationEntries.filter((_, itemIndex) => itemIndex !== index);
                      setCertificationEntries(next);
                      updateProfile({
                        certificationEntries: next,
                        certifications: serializeCertificationEntries(next),
                      });
                      if (entry.attachmentStoragePath) {
                        await deleteProfileAttachment(entry.attachmentStoragePath);
                      }
                    }}
                  />
                ))
              ) : (
                <EmptyListCard
                  title="No certifications added yet"
                  description="Add certificates, credential IDs, and attachments."
                  actionLabel="Add Certification"
                  onAction={() => setEditingCertificationIndex(-1)}
                />
              )}
            </div>
          </ProfileSection>

          <ProfileSection title="Awards" description="Highlight achievements and recognitions.">
            <EntriesHeader actionLabel="Add Award" onAction={() => setEditingAwardIndex(-1)} />

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {awardEntries.length > 0 ? (
                awardEntries.map((entry, index) => (
                  <AwardCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => setEditingAwardIndex(index)}
                    onDelete={async () => {
                      const next = awardEntries.filter((_, itemIndex) => itemIndex !== index);
                      setAwardEntries(next);
                      updateProfile({
                        awardEntries: next,
                        awards: serializeAwardEntries(next),
                      });
                      if (entry.attachmentStoragePath) {
                        await deleteProfileAttachment(entry.attachmentStoragePath);
                      }
                    }}
                  />
                ))
              ) : (
                <EmptyListCard
                  title="No awards added yet"
                  description="Add awards, recognition, and attachment files."
                  actionLabel="Add Award"
                  onAction={() => setEditingAwardIndex(-1)}
                />
              )}
            </div>
          </ProfileSection>

          <ProfileSection title="Skills" description="List your professional skills." badge={`${skills.length}/20`}>
            <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-[color:var(--foreground)] shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground-strong)]"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[color:var(--foreground-muted)]">Add your skills separated by commas.</p>
                )}
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <FormField label="Type a skill" error={errors.skills?.message} hint="Separate with commas">
                <input
                  {...register("skills")}
                  className="ds-input"
                  placeholder="AutoCAD, Leadership, Project management"
                />
              </FormField>
            </div>
          </ProfileSection>

          <ProfileSection title="Languages" description="List the languages you speak fluently." badge={`${languages.length}/20`}>
            <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
              <div className="flex flex-wrap gap-2">
                {languages.length > 0 ? (
                  languages.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-[color:var(--foreground)] shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground-strong)]"
                        aria-label={`Remove ${language}`}
                      >
                        ×
                      </button>
                      {language}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[color:var(--foreground-muted)]">Add the languages you speak.</p>
                )}
              </div>
            </div>
            <FormField label="Languages" error={errors.languages?.message} hint="Separate with commas">
              <input {...register("languages")} className="ds-input" placeholder="Dari, Pashto, English" />
            </FormField>
          </ProfileSection>

          <ProfileSection title="Social Profiles" description="Add your professional profiles.">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Portfolio Link" error={errors.portfolioUrl?.message}>
                <input {...register("portfolioUrl")} className="ds-input" placeholder="https://" />
              </FormField>
              <FormField label="LinkedIn" error={errors.linkedinUrl?.message}>
                <input {...register("linkedinUrl")} className="ds-input" placeholder="https://linkedin.com/in/username" />
              </FormField>
              <FormField label="Github" error={errors.githubUrl?.message}>
                <input {...register("githubUrl")} className="ds-input" placeholder="https://github.com/username" />
              </FormField>
              <FormField label="Twitter" error={errors.twitterUrl?.message}>
                <input {...register("twitterUrl")} className="ds-input" placeholder="https://x.com/username" />
              </FormField>
              <FormField label="Resume URL" error={errors.resumeUrl?.message}>
                <input {...register("resumeUrl")} className="ds-input" placeholder="Upload link or file URL" />
              </FormField>
              <FormField label="Video Intro" error={errors.introVideoUrl?.message}>
                <input {...register("introVideoUrl")} className="ds-input" placeholder="https://..." />
              </FormField>
            </div>
          </ProfileSection>

          <ProfileSection title="Supporting Documents" description="Keep your documents ready for applications.">
            <EntriesHeader actionLabel="Add Document" onAction={() => setEditingDocumentIndex(-1)} />

            <input {...register("documents")} type="hidden" />

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {documentEntries.length > 0 ? (
                documentEntries.map((entry, index) => (
                  <DocumentCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => setEditingDocumentIndex(index)}
                    onDelete={async () => {
                      const next = documentEntries.filter((_, itemIndex) => itemIndex !== index);
                      setDocumentEntries(next);
                      updateProfile({
                        documentEntries: next,
                        documents: serializeDocumentEntries(next),
                      });
                      if (entry.attachmentStoragePath) {
                        await deleteProfileAttachment(entry.attachmentStoragePath);
                      }
                    }}
                  />
                ))
              ) : (
                <EmptyListCard
                  title="No documents added yet"
                  description="Upload CVs, IDs, passports, transcripts, or other supporting files."
                  actionLabel="Add Document"
                  onAction={() => setEditingDocumentIndex(-1)}
                />
              )}
            </div>
          </ProfileSection>

        <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="ds-button-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <ExperienceEntryDialog
        open={editingExperienceIndex !== null}
        initialValues={
          editingExperienceIndex === null
            ? null
            : editingExperienceIndex < 0
              ? null
              : mapExperienceEntryToForm(experienceEntries[editingExperienceIndex] ?? null)
        }
        onClose={() => setEditingExperienceIndex(null)}
        onSave={(values) => {
          const nextEntry = mapExperienceFormToEntry(values, experienceEntries[editingExperienceIndex ?? -1]?.id);
          const nextEntries =
            editingExperienceIndex === null || editingExperienceIndex < 0
              ? [nextEntry, ...experienceEntries]
              : experienceEntries.map((entry, index) => (index === editingExperienceIndex ? nextEntry : entry));

          setExperienceEntries(nextEntries);
          updateProfile({
            experienceEntries: nextEntries,
            experience: serializeExperienceEntries(nextEntries),
          });
          setEditingExperienceIndex(null);
        }}
      />

      <EducationEntryDialog
        open={editingEducationIndex !== null}
        initialValues={
          editingEducationIndex === null
            ? null
            : editingEducationIndex < 0
              ? null
              : mapEducationEntryToForm(educationEntries[editingEducationIndex] ?? null)
        }
        onClose={() => setEditingEducationIndex(null)}
        onSave={(values) => {
          const nextEntry = mapEducationFormToEntry(values, educationEntries[editingEducationIndex ?? -1]?.id);
          const nextEntries =
            editingEducationIndex === null || editingEducationIndex < 0
              ? [nextEntry, ...educationEntries]
              : educationEntries.map((entry, index) => (index === editingEducationIndex ? nextEntry : entry));

          setEducationEntries(nextEntries);
          updateProfile({
            educationEntries: nextEntries,
            education: serializeEducationEntries(nextEntries),
          });
          setEditingEducationIndex(null);
        }}
      />

      <CertificationEntryDialog
        open={editingCertificationIndex !== null}
        initialValues={
          editingCertificationIndex === null
            ? null
            : editingCertificationIndex < 0
              ? null
              : mapCertificationEntryToForm(certificationEntries[editingCertificationIndex] ?? null)
        }
        userId={user?.id ?? null}
        onClose={() => setEditingCertificationIndex(null)}
        onSave={(values) => {
          const nextEntry = mapCertificationFormToEntry(values, certificationEntries[editingCertificationIndex ?? -1]?.id);
          const nextEntries =
            editingCertificationIndex === null || editingCertificationIndex < 0
              ? [nextEntry, ...certificationEntries]
              : certificationEntries.map((entry, index) => (index === editingCertificationIndex ? nextEntry : entry));

          setCertificationEntries(nextEntries);
          updateProfile({
            certificationEntries: nextEntries,
            certifications: serializeCertificationEntries(nextEntries),
          });
          setEditingCertificationIndex(null);
        }}
      />

      <AwardEntryDialog
        open={editingAwardIndex !== null}
        initialValues={
          editingAwardIndex === null
            ? null
            : editingAwardIndex < 0
              ? null
              : mapAwardEntryToForm(awardEntries[editingAwardIndex] ?? null)
        }
        userId={user?.id ?? null}
        onClose={() => setEditingAwardIndex(null)}
        onSave={(values) => {
          const nextEntry = mapAwardFormToEntry(values, awardEntries[editingAwardIndex ?? -1]?.id);
          const nextEntries =
            editingAwardIndex === null || editingAwardIndex < 0
              ? [nextEntry, ...awardEntries]
              : awardEntries.map((entry, index) => (index === editingAwardIndex ? nextEntry : entry));

          setAwardEntries(nextEntries);
          updateProfile({
            awardEntries: nextEntries,
            awards: serializeAwardEntries(nextEntries),
          });
          setEditingAwardIndex(null);
        }}
      />

      <DocumentEntryDialog
        open={editingDocumentIndex !== null}
        initialValues={
          editingDocumentIndex === null
            ? null
            : editingDocumentIndex < 0
              ? null
              : mapDocumentEntryToForm(documentEntries[editingDocumentIndex] ?? null)
        }
        userId={user?.id ?? null}
        onClose={() => setEditingDocumentIndex(null)}
        onSave={(values) => {
          const nextEntry = mapDocumentFormToEntry(values, documentEntries[editingDocumentIndex ?? -1]?.id);
          const nextEntries =
            editingDocumentIndex === null || editingDocumentIndex < 0
              ? [nextEntry, ...documentEntries]
              : documentEntries.map((entry, index) => (index === editingDocumentIndex ? nextEntry : entry));

          setDocumentEntries(nextEntries);
          updateProfile({
            documentEntries: nextEntries,
            documents: serializeDocumentEntries(nextEntries),
          });
          setEditingDocumentIndex(null);
        }}
      />
    </div>
  );
}

function ResumeTab({
  resumeInputRef,
  resumeFiles,
  resumeUploadBusy,
  resumeUploadError,
  onPickFiles,
  onFilesChange,
  onDeleteFile,
  onDownloadFile,
}: {
  resumeInputRef: React.RefObject<HTMLInputElement | null>;
  resumeFiles: string[];
  resumeUploadBusy: boolean;
  resumeUploadError: string;
  onPickFiles: () => void;
  onFilesChange: (files: File[]) => void | Promise<void>;
  onDeleteFile: () => void | Promise<void>;
  onDownloadFile: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[1.75rem] panel p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">Resumes</h2>
          <p className="text-sm leading-6 text-[color:var(--foreground-muted)]">Add your resume here.</p>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-4 rounded-[1.25rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <button type="button" onClick={onPickFiles} className="flex items-center gap-3 text-left">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[color:var(--foreground-muted)]">
                <PlusIcon />
              </span>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {resumeUploadBusy ? "Uploading resume..." : "Choose file(s) or drag them here to upload."}
              </span>
            </button>

            <p className="text-right text-xs font-medium leading-5 text-[color:var(--foreground-muted)]">
              PDF/ DOC/ DOCX
              <br />
              Max 5 MB
            </p>

            <input
              ref={resumeInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) {
                  void onFilesChange(files);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>

          {resumeUploadError ? (
            <p className="text-sm font-medium text-[color:var(--danger)]">{resumeUploadError}</p>
          ) : null}

          <div className="space-y-3">
            {resumeFiles.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-[color:var(--surface-soft)] px-4 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.8rem] border border-[color:var(--border)] bg-white text-[10px] font-semibold text-[color:var(--foreground-muted)]">
                    PDF
                  </span>
                  <span className="truncate text-sm font-medium text-[color:var(--foreground)]">{fileName}</span>
                </div>

                <div className="flex items-center gap-3 text-[color:var(--foreground-muted)]">
                  <button
                    type="button"
                    className="hover:text-[color:var(--foreground)]"
                    aria-label={`Delete ${fileName}`}
                    onClick={() => void onDeleteFile()}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    type="button"
                    className="hover:text-[color:var(--foreground)]"
                    aria-label={`Download ${fileName}`}
                    onClick={() => void onDownloadFile()}
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">{description}</p>
        </div>
        {badge ? <Badge tone="default">{badge}</Badge> : null}
      </div>
      {children}
    </section>
  );
}

function ProfileValueBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[color:var(--foreground)]">{label}</p>
      <div className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground-muted)]">
        {value}
      </div>
    </div>
  );
}

function EntriesHeader({
  actionLabel,
  onAction,
}: {
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="max-w-2xl text-sm text-[color:var(--foreground-muted)]">
        Build your profile with structured cards that are easier to scan and edit.
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground-strong)] transition hover:bg-[color:var(--surface-soft)]"
      >
        <PlusIcon />
        {actionLabel}
      </button>
    </div>
  );
}

function EmptyListCard({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] p-6 text-center xl:col-span-2">
      <p className="text-base font-semibold text-[color:var(--foreground-strong)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
      >
        <PlusIcon />
        {actionLabel}
      </button>
    </div>
  );
}

function ExperienceCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: ExperienceEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.organization || entry.position)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">
              {entry.position}
            </p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.organization}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {formatDateRange(entry.startDate, entry.endDate, entry.currentlyWorking)}
            </p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {entry.country}
              {entry.province ? ` · ${entry.province}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label="Edit experience" onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete experience" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">
        {entry.description}
      </p>

      {entry.skills ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {splitItems(entry.skills).slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-medium text-[color:var(--foreground-muted)]"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function EducationCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: EducationEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.institution || entry.degree)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">
              {entry.degree}
            </p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.institution}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {formatDateRange(entry.startDate, entry.endDate, false)}
            </p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {entry.fieldOfStudy}
              {entry.country ? ` · ${entry.country}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label="Edit education" onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete education" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? (
        <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p>
      ) : null}
    </article>
  );
}

function CertificationCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: CertificationEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.issuingOrganization || entry.title)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">{entry.title}</p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.issuingOrganization}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              Issued {formatDateLabel(entry.issueDate)}
              {entry.expirationDate ? ` · Expires ${formatDateLabel(entry.expirationDate)}` : ""}
            </p>
            {entry.credentialId ? (
              <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">Credential ID: {entry.credentialId}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label="Edit certification" onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete certification" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.certificationUrl ? (
          <ActionChip label="Open link" onClick={() => window.open(entry.certificationUrl, "_blank", "noopener,noreferrer")} />
        ) : null}
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || "Open attachment"}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

function AwardCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: AwardEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.issuedBy || entry.title)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">{entry.title}</p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.issuedBy}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">{formatDateLabel(entry.date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label="Edit award" onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete award" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.referenceUrl ? (
          <ActionChip label="Open link" onClick={() => window.open(entry.referenceUrl, "_blank", "noopener,noreferrer")} />
        ) : null}
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || "Open attachment"}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

function DocumentCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: DocumentEntry;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.documentType || entry.title)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">{entry.title}</p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.documentType}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label="Edit document" onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete document" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || "Open attachment"}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground-strong)]"
    >
      {children}
    </button>
  );
}

function ActionChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--foreground-strong)] transition hover:bg-[color:var(--surface)]"
    >
      {label}
    </button>
  );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "U";

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function splitItems(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function removeDelimitedItem(value: string, itemToRemove: string) {
  return splitItems(value)
    .filter((item) => item.toLowerCase() !== itemToRemove.trim().toLowerCase())
    .join(", ");
}

function getProfileCompletion(
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

function serializeExperienceEntries(entries: ExperienceEntry[]) {
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

function serializeEducationEntries(entries: EducationEntry[]) {
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

function serializeCertificationEntries(entries: CertificationEntry[]) {
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

function serializeAwardEntries(entries: AwardEntry[]) {
  return entries
    .map((entry) =>
      [entry.title, entry.issuedBy, entry.date, entry.referenceUrl, entry.description, entry.attachmentFileName]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

function serializeDocumentEntries(entries: DocumentEntry[]) {
  return entries
    .map((entry) => [entry.title, entry.documentType, entry.description, entry.attachmentFileName].filter(Boolean).join("\n"))
    .join("\n\n");
}

function mapExperienceEntryToForm(entry: ExperienceEntry | null): ExperienceEntryFormValues | null {
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

function mapEducationEntryToForm(entry: EducationEntry | null): EducationEntryFormValues | null {
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

function mapCertificationEntryToForm(entry: CertificationEntry | null): CertificationEntryFormValues | null {
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

function mapAwardEntryToForm(entry: AwardEntry | null): AwardEntryFormValues | null {
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

function mapDocumentEntryToForm(entry: DocumentEntry | null): DocumentEntryFormValues | null {
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

function mapExperienceFormToEntry(values: ExperienceEntryFormValues, id?: string): ExperienceEntry {
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

function mapEducationFormToEntry(values: EducationEntryFormValues, id?: string): EducationEntry {
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

function mapCertificationFormToEntry(values: CertificationEntryFormValues, id?: string): CertificationEntry {
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

function mapAwardFormToEntry(values: AwardEntryFormValues, id?: string): AwardEntry {
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

function mapDocumentFormToEntry(values: DocumentEntryFormValues, id?: string): DocumentEntry {
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

function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateRange(startDate: string, endDate: string, currentlyWorking: boolean) {
  const startLabel = formatDateLabel(startDate);
  const endLabel = currentlyWorking ? "Present" : formatDateLabel(endDate);

  if (startLabel && endLabel) {
    return `${startLabel} - ${endLabel}`;
  }

  return startLabel || endLabel || "Date not added";
}

function formatDateLabel(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getFileNameFromUrl(value: string) {
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

function getFileNameFromPath(value: string) {
  const parts = value.split("/").filter(Boolean);
  const fileName = parts.at(-1);
  if (!fileName) {
    return "resume";
  }

  return decodeURIComponent(fileName);
}

async function resolveAttachmentEntryUrls<
  T extends { attachmentStoragePath: string; attachmentUrl: string }
>(entries: T[]) {
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4.5 7h15M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7.5 0L8 19h8l.5-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
      <path
        d="M4.5 19.5 9 18.5l9.5-9.5a1.6 1.6 0 0 0 0-2.3l-1.2-1.2a1.6 1.6 0 0 0-2.3 0L5.5 15l-1 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 4v9m0 0 3.5-3.5M12 13 8.5 9.5M5 16.5V19h14v-2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
