"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { EmptyState } from "@/components/ui";
import { useAuthContext } from "@/context/auth-context";
import { useProfileContext } from "@/context/profile-context";
import {
  AwardEntryDialog,
  CertificationEntryDialog,
  DocumentEntryDialog,
  EducationEntryDialog,
  ExperienceEntryDialog,
} from "@/components/profile/ProfileEntryDialog";
import { ProfileHeader } from "@/components/profile/profile-view/ProfileHeader";
import { ProfileResumeSection } from "@/components/profile/profile-view/ProfileResumeSection";
import { ProfileExperienceSection } from "@/components/profile/profile-view/ProfileExperienceSection";
import { ProfileEducationSection } from "@/components/profile/profile-view/ProfileEducationSection";
import { ProfileCertificationSection } from "@/components/profile/profile-view/ProfileCertificationSection";
import { ProfileAwardSection } from "@/components/profile/profile-view/ProfileAwardSection";
import { ProfileSkillsSection } from "@/components/profile/profile-view/ProfileSkillsSection";
import { ProfileLinksSection } from "@/components/profile/profile-view/ProfileLinksSection";
import { ProfileDocumentsSection } from "@/components/profile/profile-view/ProfileDocumentsSection";
import { ProfilePersonalDetailsSection } from "@/components/profile/profile-view/ProfilePersonalDetailsSection";
import {
  getProfileCompletion,
  getInitials,
  mapAwardEntryToForm,
  mapCertificationEntryToForm,
  mapDocumentEntryToForm,
  mapEducationEntryToForm,
  mapExperienceEntryToForm,
  splitItems,
} from "@/components/profile/profile-view/profile-view-helpers";
import { useProfileActions } from "@/hooks/profile/useProfileActions";
import { useProfileForm } from "@/hooks/profile/useProfileForm";
import { useProfileUpload } from "@/hooks/profile/useProfileUpload";
import { createLocalizedCountryOptions, createLocalizedGenderOptions, nationalityOptions } from "@/data/profile-options";

type ProfileTabId = "information" | "resume" | "interview";

export default function ProfileView() {
  const t = useTranslations("profile");
  const authT = useTranslations("auth");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { authenticated, user } = useAuthContext();
  const { profile } = useProfileContext();
  const [activeTab, setActiveTab] = useState<ProfileTabId>("information");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useProfileForm();

  const {
    experienceEntries,
    educationEntries,
    certificationEntries,
    awardEntries,
    documentEntries,
    editingExperienceIndex,
    editingEducationIndex,
    editingCertificationIndex,
    editingAwardIndex,
    editingDocumentIndex,
    setEditingExperienceIndex,
    setEditingEducationIndex,
    setEditingCertificationIndex,
    setEditingAwardIndex,
    setEditingDocumentIndex,
    addExperience,
    addEducation,
    addCertification,
    addAward,
    addDocument,
    deleteExperience,
    deleteEducation,
    deleteCertification,
    deleteAward,
    deleteDocument,
    removeSkill,
    removeLanguage,
  } = useProfileActions();

  const {
    resumeFiles,
    resumeUploadBusy,
    resumeUploadError,
    uploadAvatar,
    uploadResumeFiles,
    deleteResume,
    downloadResume,
  } = useProfileUpload(user?.id ?? null);

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);
  const initials = useMemo(() => getInitials(profile.fullName), [profile.fullName]);
  const skills = useMemo(() => splitItems(profile.skills), [profile.skills]);
  const languages = useMemo(() => splitItems(profile.languages), [profile.languages]);
  const showWelcome = searchParams.get("status") === "welcome";
  const selectedCountry = watch("country");
  const selectedNationality = watch("nationality");
  const selectedGender = watch("gender");
  const selectedDateOfBirth = watch("dateOfBirth");
  const countryOptions = useMemo(() => createLocalizedCountryOptions(locale), [locale]);
  const genderOptions = useMemo(
    () =>
      createLocalizedGenderOptions((key) => {
        if (key === "female") return t("personal.genderOptions.female");
        if (key === "male") return t("personal.genderOptions.male");
        return t("personal.genderOptions.preferNotToSay");
      }),
    [t]
  );

  const profileTabs: Array<{
    id: ProfileTabId;
    label: string;
    disabled?: boolean;
  }> = [
    { id: "information", label: t("tabs.information") },
    { id: "resume", label: t("tabs.resume") },
    { id: "interview", label: t("tabs.interview"), disabled: true },
  ];

  if (!authenticated) {
    return (
      <EmptyState
        title={t("signInTitle")}
        description={t("signInDescription")}
        actionHref="/login"
        actionLabel={authT("loginButtonLabel")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        showWelcome={showWelcome}
        signupSuccessTitle={authT("signupSuccessTitle")}
        signupSuccessMessage={authT("signupSuccessMessage")}
        title={t("pageTitle")}
      />

      <section className="rounded-[1.75rem] panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[color:var(--accent-soft)] bg-[color:var(--surface-soft)] text-2xl font-semibold text-[color:var(--foreground-strong)] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName || t("profilePhotoAlt")}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="text-base font-medium leading-7 text-[color:var(--foreground)] sm:text-lg">
                {t("completeProfileTitle")}
              </p>
              <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">{t("completeProfileDescription")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end lg:gap-2">
            <span className="text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">{completion}%</span>
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
        <ProfileResumeSection
          resumeInputRef={resumeInputRef}
          resumeFiles={resumeFiles}
          resumeUploadBusy={resumeUploadBusy}
          resumeUploadError={resumeUploadError}
          onPickFiles={() => resumeInputRef.current?.click()}
          onFilesChange={uploadResumeFiles}
          onDeleteFile={deleteResume}
          onDownloadFile={downloadResume}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            noMatchesLabel={commonT("noMatchesFound")}
            onPickAvatar={() => {
              avatarInputRef.current?.click();
            }}
            onAvatarFileChange={(file) => {
              void uploadAvatar(file);
            }}
          />

          <ProfileExperienceSection
            entries={experienceEntries}
            onAdd={() => setEditingExperienceIndex(-1)}
            onEdit={setEditingExperienceIndex}
            onDelete={deleteExperience}
          />

          <ProfileEducationSection
            entries={educationEntries}
            onAdd={() => setEditingEducationIndex(-1)}
            onEdit={setEditingEducationIndex}
            onDelete={deleteEducation}
          />

          <ProfileCertificationSection
            entries={certificationEntries}
            onAdd={() => setEditingCertificationIndex(-1)}
            onEdit={setEditingCertificationIndex}
            onDelete={deleteCertification}
          />

          <ProfileAwardSection
            entries={awardEntries}
            onAdd={() => setEditingAwardIndex(-1)}
            onEdit={setEditingAwardIndex}
            onDelete={deleteAward}
          />

          <ProfileSkillsSection
            skills={skills}
            languages={languages}
            errors={errors}
            register={register}
            onRemoveSkill={removeSkill}
            onRemoveLanguage={removeLanguage}
          />

          <ProfileLinksSection errors={errors} register={register} />

          <ProfileDocumentsSection
            entries={documentEntries}
            onAdd={() => setEditingDocumentIndex(-1)}
            onEdit={setEditingDocumentIndex}
            onDelete={deleteDocument}
            register={register}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="ds-button-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {t("save")}
            </button>
          </div>
        </form>
      )}

      {editingExperienceIndex !== null ? (
        <ExperienceEntryDialog
          open
          initialValues={
            editingExperienceIndex < 0
              ? null
              : mapExperienceEntryToForm(experienceEntries[editingExperienceIndex] ?? null)
          }
          onClose={() => setEditingExperienceIndex(null)}
          onSave={addExperience}
        />
      ) : null}

      {editingEducationIndex !== null ? (
        <EducationEntryDialog
          open
          initialValues={
            editingEducationIndex < 0
              ? null
              : mapEducationEntryToForm(educationEntries[editingEducationIndex] ?? null)
          }
          onClose={() => setEditingEducationIndex(null)}
          onSave={addEducation}
        />
      ) : null}

      {editingCertificationIndex !== null ? (
        <CertificationEntryDialog
          open
          initialValues={
            editingCertificationIndex < 0
              ? null
              : mapCertificationEntryToForm(certificationEntries[editingCertificationIndex] ?? null)
          }
          userId={user?.id ?? null}
          onClose={() => setEditingCertificationIndex(null)}
          onSave={addCertification}
        />
      ) : null}

      {editingAwardIndex !== null ? (
        <AwardEntryDialog
          open
          initialValues={
            editingAwardIndex < 0
              ? null
              : mapAwardEntryToForm(awardEntries[editingAwardIndex] ?? null)
          }
          userId={user?.id ?? null}
          onClose={() => setEditingAwardIndex(null)}
          onSave={addAward}
        />
      ) : null}

      {editingDocumentIndex !== null ? (
        <DocumentEntryDialog
          open
          initialValues={
            editingDocumentIndex < 0
              ? null
              : mapDocumentEntryToForm(documentEntries[editingDocumentIndex] ?? null)
          }
          userId={user?.id ?? null}
          onClose={() => setEditingDocumentIndex(null)}
          onSave={addDocument}
        />
      ) : null}
    </div>
  );
}
