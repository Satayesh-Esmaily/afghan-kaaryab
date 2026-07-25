"use client";

import { useTranslations } from "next-intl";
import FormField from "@/components/common/FormField";
import { ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { ProfileFormValues } from "@/lib/schemas";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type ProfileLinksSectionProps = {
  errors: FieldErrors<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
};

export function ProfileLinksSection({ errors, register }: ProfileLinksSectionProps) {
  const t = useTranslations("profile.links");

  return (
    <ProfileSection title={t("title")} description={t("description")}>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={t("portfolioLink")} error={errors.portfolioUrl?.message}>
          <input {...register("portfolioUrl")} className="ds-input" placeholder={t("portfolioPlaceholder")} />
        </FormField>
        <FormField label={t("linkedin")} error={errors.linkedinUrl?.message}>
          <input {...register("linkedinUrl")} className="ds-input" placeholder={t("linkedinPlaceholder")} />
        </FormField>
        <FormField label={t("github")} error={errors.githubUrl?.message}>
          <input {...register("githubUrl")} className="ds-input" placeholder={t("githubPlaceholder")} />
        </FormField>
        <FormField label={t("twitter")} error={errors.twitterUrl?.message}>
          <input {...register("twitterUrl")} className="ds-input" placeholder={t("twitterPlaceholder")} />
        </FormField>
        <FormField label={t("resumeUrl")} error={errors.resumeUrl?.message}>
          <input {...register("resumeUrl")} className="ds-input" placeholder={t("resumePlaceholder")} />
        </FormField>
        <FormField label={t("videoIntro")} error={errors.introVideoUrl?.message}>
          <input {...register("introVideoUrl")} className="ds-input" placeholder={t("videoPlaceholder")} />
        </FormField>
      </div>
    </ProfileSection>
  );
}
