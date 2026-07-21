"use client";

import FormField from "@/components/common/FormField";
import { ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { ProfileFormValues } from "@/lib/schemas";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type ProfileLinksSectionProps = {
  errors: FieldErrors<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
};

export function ProfileLinksSection({ errors, register }: ProfileLinksSectionProps) {
  return (
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
  );
}
