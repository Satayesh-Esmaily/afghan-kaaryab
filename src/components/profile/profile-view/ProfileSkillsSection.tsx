"use client";

import { useTranslations } from "next-intl";
import FormField from "@/components/common/FormField";
import { ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { ProfileFormValues } from "@/lib/schemas";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type ProfileSkillsSectionProps = {
  skills: string[];
  languages: string[];
  errors: FieldErrors<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  onRemoveSkill: (skill: string) => void;
  onRemoveLanguage: (language: string) => void;
};

export function ProfileSkillsSection({
  skills,
  languages,
  errors,
  register,
  onRemoveSkill,
  onRemoveLanguage,
}: ProfileSkillsSectionProps) {
  const t = useTranslations("profile.skills");

  return (
    <>
      <ProfileSection title={t("title")} description={t("description")} badge={`${skills.length}/20`}>
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
                    onClick={() => onRemoveSkill(skill)}
                    className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground-strong)]"
                    aria-label={t("removeSkill", { skill })}
                  >
                    x
                  </button>
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-[color:var(--foreground-muted)]">{t("addSkillsHint")}</p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <FormField label={t("typeSkill")} error={errors.skills?.message} hint={t("skillsHint")}>
            <input {...register("skills")} className="ds-input" placeholder={t("skillsPlaceholder")} />
          </FormField>
        </div>
      </ProfileSection>

      <ProfileSection title={t("languagesTitle")} description={t("languagesDescription")} badge={`${languages.length}/20`}>
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
                    onClick={() => onRemoveLanguage(language)}
                    className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground-strong)]"
                    aria-label={t("removeLanguage", { language })}
                  >
                    x
                  </button>
                  {language}
                </span>
              ))
            ) : (
              <p className="text-sm text-[color:var(--foreground-muted)]">{t("addLanguagesHint")}</p>
            )}
          </div>
        </div>
        <FormField label={t("languagesField")} error={errors.languages?.message} hint={t("languagesHint")}>
          <input {...register("languages")} className="ds-input" placeholder={t("languagesPlaceholder")} />
        </FormField>
      </ProfileSection>
    </>
  );
}
