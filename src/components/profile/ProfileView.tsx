"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Badge, EmptyState, SectionHeading, StatCard } from "@/components/ui";
import FormField from "@/components/common/FormField";
import { authCopy } from "@/config/auth";
import { useAppData } from "@/context/app-context";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas";

export default function ProfileView() {
  const { authenticated, profile, updateProfile, user } = useAppData();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
    values: profile,
  });

  if (!authenticated) {
    return (
      <EmptyState
        title="Sign in to view your profile"
        description="Your resume, skills, and saved job-seeking details are available after login."
        actionHref="/login"
        actionLabel={authCopy.loginButtonLabel}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Profile"
        title="Your job seeker profile"
        description="Keep your resume, skills, languages, and documents ready for applications."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/resume-builder"
          className="ds-button-primary inline-flex rounded-full px-4 py-2.5 text-sm font-semibold transition"
        >
          Open Resume Builder
        </Link>
        <Badge tone="default">Visible after login</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Account" value={user?.displayName ?? profile.fullName} tone="info" />
        <StatCard label="Resume" value={profile.resumeUrl ? "Added" : "Missing"} tone="accent" />
        <StatCard label="Skills" value={profile.skills ? "Ready" : "Add more"} tone="success" />
        <StatCard label="Video intro" value={profile.introVideoUrl ? "Added" : "Optional"} tone="info" />
        <StatCard label="Template" value={profile.resumeTemplate} tone="info" />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit(async (values) => {
            updateProfile(values);
          })}
          className="space-y-5 rounded-[1.5rem] panel p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">
                Candidate profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground-strong)]">
                Update your information
              </h2>
            </div>
            <Badge tone="default">Visible after login</Badge>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Full name" error={errors.fullName?.message}>
              <input {...register("fullName")} className="ds-input" />
            </FormField>
            <FormField label="Headline" error={errors.headline?.message}>
              <input {...register("headline")} className="ds-input" />
            </FormField>
            <FormField label="Avatar URL" error={errors.avatarUrl?.message}>
              <input {...register("avatarUrl")} className="ds-input" placeholder="https://..." />
            </FormField>
            <FormField label="Resume URL" error={errors.resumeUrl?.message}>
              <input {...register("resumeUrl")} className="ds-input" placeholder="Upload link or file URL" />
            </FormField>
            <FormField label="Location" error={errors.location?.message}>
              <input {...register("location")} className="ds-input" />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} className="ds-input" placeholder="+93..." />
            </FormField>
          </div>

          <FormField
            label="Skills"
            hint="Separate with commas"
            error={errors.skills?.message}
          >
            <textarea {...register("skills")} className="ds-input min-h-28" />
          </FormField>

          <FormField label="Experience" error={errors.experience?.message}>
            <textarea {...register("experience")} className="ds-input min-h-28" />
          </FormField>

          <FormField label="Education" error={errors.education?.message}>
            <textarea {...register("education")} className="ds-input min-h-28" />
          </FormField>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Languages" error={errors.languages?.message}>
              <input {...register("languages")} className="ds-input" />
            </FormField>
            <FormField label="Required documents" error={errors.documents?.message}>
              <input {...register("documents")} className="ds-input" />
            </FormField>
            <FormField label="Portfolio link" error={errors.portfolioUrl?.message}>
              <input {...register("portfolioUrl")} className="ds-input" placeholder="https://..." />
            </FormField>
            <FormField label="Video intro" error={errors.introVideoUrl?.message}>
              <input {...register("introVideoUrl")} className="ds-input" placeholder="https://..." />
            </FormField>
          </div>

          <FormField label="About you" error={errors.bio?.message}>
            <textarea {...register("bio")} className="ds-input min-h-32" />
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="ds-button-primary inline-flex rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            Save profile
          </button>
        </form>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] panel p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              Profile preview
            </p>
            <div className="mt-5 space-y-4">
              <PreviewRow label="Name" value={profile.fullName} />
              <PreviewRow label="Headline" value={profile.headline} />
              <PreviewRow label="Location" value={profile.location} />
              <PreviewRow label="Resume" value={profile.resumeUrl || "Not added"} />
              <PreviewRow label="Portfolio" value={profile.portfolioUrl || "Not added"} />
            </div>
          </div>

          <div className="rounded-[1.5rem] accent-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Why this matters
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Make your applications stronger.</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">
              A complete profile helps employers understand your background faster and lets the
              platform surface more relevant opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}
