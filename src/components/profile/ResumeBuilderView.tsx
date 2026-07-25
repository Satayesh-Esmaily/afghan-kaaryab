"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, EmptyState, SectionHeading } from "@/components/ui";
import { useAuthContext } from "@/context/auth-context";
import { useProfileContext } from "@/context/profile-context";
import type { ResumeTemplateId } from "@/context/app-context";
import { getResumeAccessUrl } from "@/lib/resume-storage";
import { formatDateRangeLocalized, getProfileCompletion, splitItems } from "@/components/profile/profile-view/profile-view-helpers";

export default function ResumeBuilderView() {
  const t = useTranslations("resumeBuilder");
  const common = useTranslations("profile.common");
  const authT = useTranslations("auth");
  const locale = useLocale();
  const { authenticated, user } = useAuthContext();
  const { profile, updateProfile } = useProfileContext();
  const [resumeActionError, setResumeActionError] = useState("");
  const [resumeActionBusy, setResumeActionBusy] = useState(false);

  const templates: Array<{
    id: ResumeTemplateId;
    label: string;
    description: string;
  }> = [
    { id: "classic", label: t("templates.classic.label"), description: t("templates.classic.description") },
    { id: "modern", label: t("templates.modern.label"), description: t("templates.modern.description") },
    { id: "compact", label: t("templates.compact.label"), description: t("templates.compact.description") },
  ];

  const skills = useMemo(
    () =>
      profile.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [profile.skills]
  );
  const completion = useMemo(() => getProfileCompletion(profile), [profile]);
  const documentTags = useMemo(() => splitItems(profile.documents), [profile.documents]);
  const hasUploadedResume = Boolean(profile.resumeStoragePath || profile.resumeUrl);
  const selectedTemplate: ResumeTemplateId = profile.resumeTemplate ?? "modern";
  const selectedTemplateCopy = templates.find((template) => template.id === selectedTemplate);

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

  const applyTemplate = (template: ResumeTemplateId) => {
    updateProfile({ resumeTemplate: template });
  };

  const openResumeFile = async () => {
    setResumeActionError("");

    const sourcePath = profile.resumeStoragePath || "";
    const sourceUrl = profile.resumeUrl || "";

    if (!sourcePath && !sourceUrl) {
      setResumeActionError(t("noUploadedResume"));
      return;
    }

    setResumeActionBusy(true);
    const previewWindow = window.open("", "_blank");

    try {
      const url = sourcePath ? await getResumeAccessUrl(sourcePath) : sourceUrl;
      if (!url) {
        setResumeActionError(t("noDownloadLink"));
        if (previewWindow) previewWindow.close();
        return;
      }

      if (previewWindow) {
        previewWindow.location.href = url;
        previewWindow.focus();
        return;
      }

      window.location.assign(url);
    } finally {
      setResumeActionBusy(false);
    }
  };

  return (
    <div className="resume-builder-page space-y-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] print:block">
        <div className="resume-builder-controls space-y-5 print:hidden">
          <div className="rounded-[1.5rem] panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
                  {t("chooseTemplate")}
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">{t("chooseTemplateHint")}</p>
              </div>
              <Badge tone="info">{selectedTemplateCopy?.label ?? selectedTemplate}</Badge>
            </div>

            <div className="mt-5 grid gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={[
                    "rounded-[1.25rem] border px-4 py-4 text-start transition",
                    selectedTemplate === template.id
                      ? "border-transparent active-pill"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-soft)]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{template.label}</p>
                      <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id ? <Badge tone="accent">{t("selected")}</Badge> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="accent-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{t("exportEyebrow")}</p>
            <h3 className="mt-3 text-2xl font-semibold">{t("exportTitle")}</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">{t("exportDescription")}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
              >
                {t("downloadPdf")}
              </button>
              <button
                type="button"
                onClick={() => void openResumeFile()}
                disabled={resumeActionBusy}
                className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resumeActionBusy ? t("opening") : t("openUploadedCv")}
              </button>
            </div>
            {resumeActionError ? <p className="mt-3 text-sm text-white/90">{resumeActionError}</p> : null}
          </div>
        </div>

        <div className="resume-print-area rounded-[1.75rem] border border-[color:var(--border)] bg-white p-6 shadow-sm print:border-0 print:p-0">
          <div
            className={[
              "overflow-hidden rounded-[1.5rem]",
              selectedTemplate === "classic"
                ? "bg-[#f7f4ef]"
                : selectedTemplate === "compact"
                  ? "bg-[#f3f7ff]"
                  : "bg-[#f7f7fb]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">{t("brand")}</p>
                <h2 className="mt-2 text-3xl font-semibold text-black">{profile.fullName}</h2>
                <p className="mt-2 text-sm text-black/70">{profile.headline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                    {t("resumeSource")}: {hasUploadedResume ? t("uploadedCv") : t("profileText")}
                  </span>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                    {t("template")}: {selectedTemplate}
                  </span>
                </div>
              </div>
              <Badge tone="default">{user?.email ?? t("candidateProfile")}</Badge>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5">
                <ResumePanel title={t("profileSnapshot")}>
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-black/5 text-xl font-semibold text-black">
                      {getResumeInitials(profile.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-black">{profile.fullName}</p>
                      <p className="mt-1 text-sm text-black/65">{profile.headline}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                          {selectedTemplateCopy?.label ?? selectedTemplate}
                        </span>
                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                          {completion}% {t("ready")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <ProfileLine label={t("location")} value={profile.location || common("notAdded")} />
                    <ProfileLine
                      label={t("resumeSource")}
                      value={hasUploadedResume ? t("uploadedCv") : t("profileText")}
                    />
                  </div>
                </ResumePanel>

                <ResumePanel title={t("contact")}>
                  <ProfileLine label={t("location")} value={profile.location || common("notAdded")} />
                  <ProfileLine label={t("phone")} value={profile.phone || common("notAdded")} />
                  <ProfileLine label={t("email")} value={user?.email ?? common("notAdded")} />
                  <ProfileLine
                    label={t("cvFile")}
                    value={
                      profile.resumeStoragePath
                        ? getFileNameFromPath(profile.resumeStoragePath)
                        : profile.resumeUrl
                          ? getFileNameFromUrl(profile.resumeUrl)
                          : common("notAdded")
                    }
                  />
                </ResumePanel>

                <ResumePanel title={t("skills")}>
                  <TagWrap items={skills.length > 0 ? skills : [t("addYourSkills")]} />
                </ResumePanel>

                <ResumePanel title={t("languages")}>
                  <p className="text-sm leading-7 text-black/75">{profile.languages || common("notAdded")}</p>
                </ResumePanel>

                <ResumePanel title={t("quickLinks")}>
                  <div className="space-y-2">
                    <ProfileLine label={t("portfolio")} value={profile.portfolioUrl || common("notAdded")} />
                    <ProfileLine label={t("linkedin")} value={profile.linkedinUrl || common("notAdded")} />
                    <ProfileLine label={t("github")} value={profile.githubUrl || common("notAdded")} />
                    <ProfileLine label={t("twitter")} value={profile.twitterUrl || common("notAdded")} />
                    <ProfileLine label={t("videoIntro")} value={profile.introVideoUrl || common("notAdded")} />
                  </div>
                </ResumePanel>
              </div>

              <div className="space-y-5">
                <ResumePanel title={t("experience")}>
                  {profile.experienceEntries.length > 0 ? (
                    <div className="space-y-3">
                      {profile.experienceEntries.map((entry) => (
                        <div key={entry.id} className="rounded-[1rem] border border-black/5 bg-white px-4 py-3">
                          <p className="break-words text-sm font-semibold text-black">{entry.position}</p>
                          <p className="mt-1 break-words text-xs text-black/55">{entry.organization}</p>
                          <p className="mt-1 text-xs text-black/45">
                            {formatDateRangeLocalized(
                              entry.startDate,
                              entry.endDate,
                              entry.currentlyWorking,
                              locale,
                              t("present"),
                              t("dateNotAdded")
                            )}
                          </p>
                          <p className="mt-2 break-words text-sm leading-6 text-black/75">{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-7 whitespace-pre-line text-black/75">{profile.experience || common("notAdded")}</p>
                  )}
                </ResumePanel>

                <ResumePanel title={t("education")}>
                  {profile.educationEntries.length > 0 ? (
                    <div className="space-y-3">
                      {profile.educationEntries.map((entry) => (
                        <div key={entry.id} className="rounded-[1rem] border border-black/5 bg-white px-4 py-3">
                          <p className="break-words text-sm font-semibold text-black">{entry.degree}</p>
                          <p className="mt-1 break-words text-xs text-black/55">{entry.institution}</p>
                          <p className="mt-1 text-xs text-black/45">
                            {formatDateRangeLocalized(entry.startDate, entry.endDate, false, locale, t("present"), t("dateNotAdded"))}
                          </p>
                          <p className="mt-2 break-words text-sm leading-6 text-black/75">{entry.fieldOfStudy}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-7 whitespace-pre-line text-black/75">{profile.education || common("notAdded")}</p>
                  )}
                </ResumePanel>

                <ResumePanel title={t("summary")}>
                  <p className="break-words text-sm leading-7 text-black/75">{profile.bio || common("notAdded")}</p>
                </ResumePanel>

                <ResumePanel title={t("supportingDocuments")}>
                  <div className="space-y-3 text-sm text-black/75">
                    <ProfileLine label={t("resume")} value={profile.resumeStoragePath ? getFileNameFromPath(profile.resumeStoragePath) : common("notAdded")} />
                    <div className="rounded-[1rem] border border-black/5 bg-white px-4 py-4">
                      <p className="text-sm font-medium text-black/55">{t("documents")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {documentTags.length > 0 ? (
                          documentTags.map((item) => (
                            <span key={item} className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/75">
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-black/55">{common("notAdded")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {profile.documentEntries.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {profile.documentEntries.map((entry) => (
                        <div key={entry.id} className="rounded-[1rem] border border-black/5 bg-white px-4 py-3">
                          <p className="break-words text-sm font-semibold text-black">{entry.title}</p>
                          <p className="mt-1 text-xs text-black/55">{entry.documentType}</p>
                          <p className="mt-2 break-words text-sm leading-6 text-black/75">
                            {entry.description || t("supportingDocument")}
                          </p>
                          <p className="mt-2 break-words text-xs text-black/45">
                            {entry.attachmentFileName || t("attachedFile")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </ResumePanel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-black/5 bg-white/70 px-5 py-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-2.5 last:border-b-0 last:pb-0">
      <span className="text-sm text-black/55">{label}</span>
      <span className="max-w-[60%] text-end text-sm font-medium text-black">{value}</span>
    </div>
  );
}

function TagWrap({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/75">
          {item}
        </span>
      ))}
    </div>
  );
}

function getFileNameFromPath(value: string) {
  const parts = value.split("/").filter(Boolean);
  const fileName = parts.at(-1);

  if (!fileName) {
    return "resume";
  }

  return decodeURIComponent(fileName);
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
    return getFileNameFromPath(value);
  }
}

function getResumeInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "U";
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}
