"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmptyState } from "@/components/ui";
import FormField from "@/components/common/FormField";
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
import {
  AwardCard,
  CertificationCard,
  DocumentCard,
  EducationCard,
  EmptyListCard,
  EntriesHeader,
  ExperienceCard,
  ProfileSection,
  ResumeTab,
} from "@/components/profile/profile-view/ProfileViewParts";
import { ProfilePersonalDetailsSection } from "@/components/profile/profile-view/ProfilePersonalDetailsSection";
import { ProfileViewHeader } from "@/components/profile/profile-view/ProfileViewHeader";
import {
  formatDateRange,
  getFileNameFromPath,
  getFileNameFromUrl,
  getInitials,
  getProfileCompletion,
  mapAwardEntryToForm,
  mapAwardFormToEntry,
  mapCertificationEntryToForm,
  mapCertificationFormToEntry,
  mapDocumentEntryToForm,
  mapDocumentFormToEntry,
  mapEducationEntryToForm,
  mapEducationFormToEntry,
  mapExperienceEntryToForm,
  mapExperienceFormToEntry,
  removeDelimitedItem,
  resolveAttachmentEntryUrls,
  serializeAwardEntries,
  serializeCertificationEntries,
  serializeDocumentEntries,
  serializeEducationEntries,
  serializeExperienceEntries,
  splitItems,
} from "@/components/profile/profile-view/profile-view-helpers";
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
      <ProfileViewHeader
        showWelcome={showWelcome}
        signupSuccessTitle={authCopy.signupSuccessTitle}
        signupSuccessMessage={authCopy.signupSuccessMessage}
        title="Profile"
      />

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
          <ProfilePersonalDetailsSection
            avatarInputRef={avatarInputRef}
            avatarUrl={profile.avatarUrl}
            initials={initials}
            completion={completion}
            userEmail={user?.email ?? ""}
            errors={errors}
            register={register}
            setValue={setValue}
            selectedCountry={selectedCountry}
            selectedNationality={selectedNationality}
            selectedGender={selectedGender}
            selectedDateOfBirth={selectedDateOfBirth}
            countryOptions={countryOptions}
            nationalityOptions={nationalityOptions}
            genderOptions={genderOptions}
            onPickAvatar={() => {
              avatarInputRef.current?.click();
            }}
            onAvatarFileChange={(file) => {
              if (!file) return;

              void uploadAvatarFile(file, user?.id ?? "").then((result) => {
                if (result) {
                  updateProfile({ avatarUrl: result.url, avatarStoragePath: result.path });
                }
              });
            }}
          />

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

 

