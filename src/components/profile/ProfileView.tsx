"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, EmptyState } from "@/components/ui";
import FormField from "@/components/common/FormField";
import { authCopy } from "@/config/auth";
import { useAppData } from "@/context/app-context";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas";

const profileTabs: Array<{
  id: "information" | "resume" | "preferences" | "interview";
  label: string;
  disabled?: boolean;
}> = [
  { id: "information", label: "Profile Information" },
  { id: "resume", label: "Resume" },
  { id: "preferences", label: "Preferences" },
  { id: "interview", label: "AI Interview (Coming Soon)", disabled: true },
] as const;

export default function ProfileView() {
  const { authenticated, profile, updateProfile, user } = useAppData();
  const [activeTab, setActiveTab] = useState<(typeof profileTabs)[number]["id"]>("information");

  const {
    register,
    handleSubmit,
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
      <div className="rounded-[1.5rem] panel px-5 py-4 text-lg font-semibold text-[color:var(--foreground)] sm:px-6">
        Profile
      </div>

      <section className="rounded-[1.75rem] panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[color:var(--accent-soft)] bg-[color:var(--surface-soft)] text-2xl font-semibold text-[color:var(--foreground-strong)] shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
              {initials}
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

      <form
        onSubmit={handleSubmit(async (values) => {
          updateProfile(values);
        })}
        className="space-y-6"
      >
        <ProfileSection
          title="Personal Details"
          description="Share your expertise and complete your profile."
        >
          <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
            <aside className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--surface-soft)] text-3xl font-semibold text-[color:var(--foreground-strong)]">
                  {initials}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("avatarUrl")?.focus();
                  }}
                  className="ds-button-secondary rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  Upload Photo
                </button>
              </div>

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
                  <input {...register("country")} className="ds-input" />
                </FormField>
                <FormField label="Province" error={errors.province?.message}>
                  <input {...register("province")} className="ds-input" />
                </FormField>
                <FormField label="Nationality" error={errors.nationality?.message}>
                  <input {...register("nationality")} className="ds-input" />
                </FormField>
                <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
                  <input {...register("dateOfBirth")} className="ds-input" placeholder="19 Mar, 1993" />
                </FormField>
                <FormField label="Gender" error={errors.gender?.message}>
                  <input {...register("gender")} className="ds-input" placeholder="Female" />
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

        <ProfileSection title="Work Experience" description="List your previous roles and responsibilities.">
          <FormField label="Experience" error={errors.experience?.message}>
            <textarea {...register("experience")} className="ds-input min-h-40" />
          </FormField>
        </ProfileSection>

        <ProfileSection title="Education" description="Add your educational background.">
          <FormField label="Education" error={errors.education?.message}>
            <textarea {...register("education")} className="ds-input min-h-40" />
          </FormField>
        </ProfileSection>

        <ProfileSection title="Certifications" description="Showcase certificates and credentials that strengthen your profile.">
          <FormField label="Certifications" error={errors.certifications?.message}>
            <textarea
              {...register("certifications")}
              className="ds-input min-h-32"
              placeholder="PMP, Google Career Certificate, etc."
            />
          </FormField>
        </ProfileSection>

        <ProfileSection title="Awards" description="Highlight achievements and recognitions.">
          <FormField label="Awards" error={errors.awards?.message}>
            <textarea
              {...register("awards")}
              className="ds-input min-h-32"
              placeholder="List awards, scholarships, or recognitions."
            />
          </FormField>
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
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)]">
                      ×
                    </span>
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
              <input {...register("skills")} className="ds-input" placeholder="AutoCAD, Leadership, Project management" />
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
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[10px] text-[color:var(--foreground-muted)]">
                      ×
                    </span>
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
          <FormField label="Required Documents" error={errors.documents?.message}>
            <input {...register("documents")} className="ds-input" placeholder="CV, national ID, certificates" />
          </FormField>
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
    </div>
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

function getProfileCompletion(profile: ProfileFormValues) {
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
    "experience",
    "education",
    "certifications",
    "awards",
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

  return Math.min(100, Math.round((filled / fields.length) * 100));
}
