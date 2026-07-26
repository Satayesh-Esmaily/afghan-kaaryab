"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, EmptyState, SectionHeading } from "@/components/ui";
import { useAuthContext } from "@/context/auth-context";
import { useProfileContext } from "@/context/profile-context";
import { useThemeContext } from "@/context/theme-context";
import type { ResumeTemplateId } from "@/context/app-context";
import { getResumeAccessUrl } from "@/lib/resume-storage";
import { formatDateRangeLocalized, getProfileCompletion, splitItems } from "@/components/profile/profile-view/profile-view-helpers";

const TEMPLATE_STYLES: Record<
  ResumeTemplateId,
  {
    light: {
      frame: string;
      paper: string;
      panel: string;
      card: string;
      title: string;
      muted: string;
      faint: string;
      chip: string;
      chipStrong: string;
    };
    dark: {
      frame: string;
      paper: string;
      panel: string;
      card: string;
      title: string;
      muted: string;
      faint: string;
      chip: string;
      chipStrong: string;
    };
  }
> = {
  classic: {
    light: {
      frame: "border-[#ead8b5] bg-[#fcf6ea] text-[#2b2215] shadow-[0_24px_60px_rgba(179,131,55,0.12)]",
      paper: "bg-[#fffaf0]",
      panel: "border-[#ead8b5] bg-[#fffdf8]",
      card: "border-[#ead8b5] bg-[#fffdf7]",
      title: "text-[#2b2215]",
      muted: "text-[#6d5b44]",
      faint: "text-[#8c7657]",
      chip: "bg-[#f5e2bc] text-[#7d5917]",
      chipStrong: "bg-[#d4b06d] text-[#231709]",
    },
    dark: {
      frame: "border-[#3a2f1f] bg-[#13100c] text-[#f7efde] shadow-[0_26px_70px_rgba(0,0,0,0.44)]",
      paper: "bg-[#14110f]",
      panel: "border-[#3b2c1c] bg-[#1c150f]",
      card: "border-[#3b2c1c] bg-[#20190f]",
      title: "text-[#f8eed3]",
      muted: "text-[#d9c6a6]",
      faint: "text-[#c0ab87]",
      chip: "bg-[#2e2418] text-[#f0dfba]",
      chipStrong: "bg-[#d4b06d] text-[#1f1409]",
    },
  },
  modern: {
    light: {
      frame: "border-[#dce5ff] bg-[#f4f7ff] text-[#152033] shadow-[0_24px_60px_rgba(114,93,255,0.12)]",
      paper: "bg-[#ffffff]",
      panel: "border-[#d8e3ff] bg-[#f9fbff]",
      card: "border-[#d8e3ff] bg-[#ffffff]",
      title: "text-[#152033]",
      muted: "text-[#5d6777]",
      faint: "text-[#788396]",
      chip: "bg-[#e7ecff] text-[#4b56d2]",
      chipStrong: "bg-[#725dff] text-white",
    },
    dark: {
      frame: "border-[#26314e] bg-[#101522] text-[#eef3ff] shadow-[0_26px_70px_rgba(0,0,0,0.44)]",
      paper: "bg-[#101522]",
      panel: "border-[#25314a] bg-[#151b2b]",
      card: "border-[#27324a] bg-[#1a2236]",
      title: "text-[#f4f7ff]",
      muted: "text-[#b6c0d5]",
      faint: "text-[#9da8be]",
      chip: "bg-[#1b2340] text-[#d9e1ff]",
      chipStrong: "bg-[#725dff] text-white",
    },
  },
  compact: {
    light: {
      frame: "border-[#d7efe4] bg-[#f0fbf6] text-[#12231d] shadow-[0_24px_60px_rgba(36,180,126,0.12)]",
      paper: "bg-[#fbfffd]",
      panel: "border-[#d3eadf] bg-[#f6fffb]",
      card: "border-[#cfe8dc] bg-[#ffffff]",
      title: "text-[#13231d]",
      muted: "text-[#557166]",
      faint: "text-[#72877d]",
      chip: "bg-[#def4ea] text-[#166b4f]",
      chipStrong: "bg-[#24b47e] text-white",
    },
    dark: {
      frame: "border-[#234137] bg-[#0f1714] text-[#ebfff5] shadow-[0_26px_70px_rgba(0,0,0,0.44)]",
      paper: "bg-[#0f1714]",
      panel: "border-[#234036] bg-[#12201b]",
      card: "border-[#234036] bg-[#162621]",
      title: "text-[#edfff6]",
      muted: "text-[#b6d5c8]",
      faint: "text-[#8fb0a0]",
      chip: "bg-[#173228] text-[#d6f4e5]",
      chipStrong: "bg-[#24b47e] text-[#07140e]",
    },
  },
};

export default function ResumeBuilderView() {
  const t = useTranslations("resumeBuilder");
  const common = useTranslations("profile.common");
  const authT = useTranslations("auth");
  const locale = useLocale();
  const { theme } = useThemeContext();
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
  const isDarkTheme = theme === "dark";
  const selectedTemplateStyle = isDarkTheme ? TEMPLATE_STYLES[selectedTemplate].dark : TEMPLATE_STYLES[selectedTemplate].light;
  const selectedTemplateTone = isDarkTheme ? "dark" : "light";
  const previewMutedClass = selectedTemplateStyle.muted;
  const previewFaintClass = selectedTemplateStyle.faint;
  const previewSoftClass = selectedTemplateStyle.chip;
  const previewShellClass = selectedTemplateStyle.frame;
  const previewPaperClass = selectedTemplateStyle.paper;
  const previewPanelClass = selectedTemplateStyle.panel;
  const previewCardClass = selectedTemplateStyle.card;
  const previewTitleClass = selectedTemplateStyle.title;

  if (!authenticated) {
    return (
      <EmptyState
        title={t("signInTitle")}
        description={t("signInDescription")}
        actionHref={`/${locale}/login`}
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
              <Badge tone="info" className="min-w-0 max-w-[12rem] truncate">
                {selectedTemplateCopy?.label ?? selectedTemplate}
              </Badge>
            </div>

            <div className="mt-5 grid gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={[
                    "rounded-[1.35rem] border px-4 py-4 text-start transition duration-200",
                    selectedTemplate === template.id
                      ? "border-transparent active-pill shadow-[0_16px_32px_rgba(114,93,255,0.18)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] hover:-translate-y-0.5 hover:bg-[color:var(--surface-soft)]",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border",
                        selectedTemplate === template.id
                          ? "border-white/20 bg-white/12"
                          : "border-[color:var(--border)] bg-[color:var(--surface-soft)]",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <TemplateMiniPreview id={template.id} tone={selectedTemplateTone} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{template.label}</p>
                        {selectedTemplate === template.id ? <Badge tone="accent">{t("selected")}</Badge> : null}
                      </div>
                      <p
                        className={[
                          "mt-1 text-sm leading-6",
                          selectedTemplate === template.id ? "text-white/80" : "text-[color:var(--foreground-muted)]",
                        ].join(" ")}
                      >
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="accent-panel rounded-[1.5rem] p-6 print:hidden">
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

        <div
          className={[
            "resume-print-area rounded-[1.75rem] border p-6 shadow-sm print:border-0 print:p-0",
            previewShellClass,
            "print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]",
          ].join(" ")}
        >
          <div
            className={[
              "overflow-hidden rounded-[1.5rem] print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]",
              previewPaperClass,
            ].join(" ")}
          >
            <div
              className={[
                "flex flex-col gap-4 border-b px-6 py-6 sm:flex-row sm:items-start sm:justify-between",
                isDarkTheme ? "border-white/10" : "border-black/5",
              ].join(" ")}
            >
              <div className="min-w-0">
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.28em]",
                    isDarkTheme ? "text-white/45" : "text-black/45",
                  ].join(" ")}
                >
                  {t("brand")}
                </p>
                <h2 className={["mt-2 break-words text-3xl font-semibold", previewTitleClass].join(" ")}>
                  {profile.fullName}
                </h2>
                <p className={["mt-2 text-sm break-words", previewMutedClass].join(" ")}>{profile.headline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", previewSoftClass].join(" ")}>
                    {t("resumeSource")}: {hasUploadedResume ? t("uploadedCv") : t("profileText")}
                  </span>
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", previewSoftClass].join(" ")}>
                    {t("template")}: {selectedTemplateCopy?.label ?? selectedTemplate}
                  </span>
                </div>
              </div>
              <Badge
                tone="default"
                className="min-w-0 max-w-full shrink truncate sm:max-w-[18rem]"
                title={user?.email ?? t("candidateProfile")}
              >
                {user?.email ?? t("candidateProfile")}
              </Badge>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-5">
                <ResumePanel title={t("profileSnapshot")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                    <div
                      className={[
                        "flex h-16 w-16 items-center justify-center rounded-[1.25rem] text-xl font-semibold",
                        selectedTemplateStyle.chipStrong,
                      ].join(" ")}
                    >
                      {getResumeInitials(profile.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className={["truncate text-base font-semibold", previewTitleClass].join(" ")}>
                        {profile.fullName}
                      </p>
                      <p className={["mt-1 text-sm break-words", previewMutedClass].join(" ")}>{profile.headline}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={["rounded-full px-3 py-1 text-xs font-semibold", previewSoftClass].join(" ")}>
                          {selectedTemplateCopy?.label ?? selectedTemplate}
                        </span>
                        <span className={["rounded-full px-3 py-1 text-xs font-semibold", previewSoftClass].join(" ")}>
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

                <ResumePanel title={t("contact")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
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

                <ResumePanel title={t("skills")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  <TagWrap items={skills.length > 0 ? skills : [t("addYourSkills")]} chipClass={previewSoftClass} />
                </ResumePanel>

                <ResumePanel title={t("languages")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  <p className={["text-sm leading-7", previewMutedClass].join(" ")}>{profile.languages || common("notAdded")}</p>
                </ResumePanel>

                <ResumePanel title={t("quickLinks")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
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
                <ResumePanel title={t("experience")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  {profile.experienceEntries.length > 0 ? (
                    <div className="space-y-3">
                      {profile.experienceEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className={[
                            "rounded-[1rem] px-4 py-3 shadow-sm",
                            previewCardClass,
                          ].join(" ")}
                        >
                          <p className={["break-words text-sm font-semibold", previewTitleClass].join(" ")}>
                            {entry.position}
                          </p>
                          <p className={["mt-1 break-words text-xs", previewFaintClass].join(" ")}>{entry.organization}</p>
                          <p className={["mt-1 text-xs", previewFaintClass].join(" ")}>
                            {formatDateRangeLocalized(
                              entry.startDate,
                              entry.endDate,
                              entry.currentlyWorking,
                              locale,
                              t("present"),
                              t("dateNotAdded")
                            )}
                          </p>
                          <p className={["mt-2 break-words text-sm leading-6", previewMutedClass].join(" ")}>
                            {entry.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={["whitespace-pre-line text-sm leading-7", previewMutedClass].join(" ")}>
                      {profile.experience || common("notAdded")}
                    </p>
                  )}
                </ResumePanel>

                <ResumePanel title={t("education")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  {profile.educationEntries.length > 0 ? (
                    <div className="space-y-3">
                      {profile.educationEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className={[
                            "rounded-[1rem] px-4 py-3 shadow-sm",
                            previewCardClass,
                          ].join(" ")}
                        >
                          <p className={["break-words text-sm font-semibold", previewTitleClass].join(" ")}>
                            {entry.degree}
                          </p>
                          <p className={["mt-1 break-words text-xs", previewFaintClass].join(" ")}>{entry.institution}</p>
                          <p className={["mt-1 text-xs", previewFaintClass].join(" ")}>
                            {formatDateRangeLocalized(entry.startDate, entry.endDate, false, locale, t("present"), t("dateNotAdded"))}
                          </p>
                          <p className={["mt-2 break-words text-sm leading-6", previewMutedClass].join(" ")}>
                            {entry.fieldOfStudy}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={["whitespace-pre-line text-sm leading-7", previewMutedClass].join(" ")}>
                      {profile.education || common("notAdded")}
                    </p>
                  )}
                </ResumePanel>

                <ResumePanel title={t("summary")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  <p className={["break-words text-sm leading-7", previewMutedClass].join(" ")}>
                    {profile.bio || common("notAdded")}
                  </p>
                </ResumePanel>

                <ResumePanel title={t("supportingDocuments")} variant={selectedTemplateTone} panelClass={previewPanelClass}>
                  <div className={["space-y-3 text-sm", previewMutedClass].join(" ")}>
                    <ProfileLine label={t("resume")} value={profile.resumeStoragePath ? getFileNameFromPath(profile.resumeStoragePath) : common("notAdded")} />
                    <div
                      className={[
                        "rounded-[1rem] px-4 py-4",
                        previewCardClass,
                      ].join(" ")}
                    >
                      <p className={["text-sm font-medium", previewFaintClass].join(" ")}>{t("documents")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {documentTags.length > 0 ? (
                          documentTags.map((item) => (
                            <span key={item} className={["rounded-full px-3 py-1 text-xs font-semibold", previewSoftClass].join(" ")}>
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className={["text-sm", previewFaintClass].join(" ")}>{common("notAdded")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {profile.documentEntries.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {profile.documentEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className={[
                            "rounded-[1rem] px-4 py-3 shadow-sm",
                            previewCardClass,
                          ].join(" ")}
                        >
                          <p className={["break-words text-sm font-semibold", previewTitleClass].join(" ")}>
                            {entry.title}
                          </p>
                          <p className={["mt-1 text-xs", previewFaintClass].join(" ")}>{entry.documentType}</p>
                          <p className={["mt-2 break-words text-sm leading-6", previewMutedClass].join(" ")}>
                            {entry.description || t("supportingDocument")}
                          </p>
                          <p className={["mt-2 break-words text-xs", previewFaintClass].join(" ")}>
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

function ResumePanel({
  title,
  children,
  variant = "light",
  panelClass = "",
}: {
  title: string;
  children: ReactNode;
  variant?: "light" | "dark";
  panelClass?: string;
}) {
  return (
    <section className={["rounded-[1.35rem] border px-5 py-5 shadow-sm", panelClass].join(" ")}>
      <h3 className={["text-sm font-semibold uppercase tracking-[0.22em]", variant === "dark" ? "text-white/55" : "text-black/45"].join(" ")}>{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-2.5 last:border-b-0 last:pb-0 dark:border-white/10">
      <span className="text-sm text-black/55 dark:text-white/55">{label}</span>
      <span className="max-w-[60%] break-words text-end text-sm font-medium text-black dark:text-white">{value}</span>
    </div>
  );
}

function TagWrap({ items, chipClass = "bg-black/5 text-black/75 dark:bg-white/8 dark:text-white/75" }: { items: string[]; chipClass?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={["rounded-full px-3 py-1 text-xs font-semibold", chipClass].join(" ")}>
          {item}
        </span>
      ))}
    </div>
  );
}

function TemplateMiniPreview({
  id,
  tone,
}: {
  id: ResumeTemplateId;
  tone: "light" | "dark";
}) {
  const isDark = tone === "dark";
  const sampleStyle = TEMPLATE_STYLES[id][tone];

  if (id === "classic") {
    return (
      <div className={["relative h-[72%] w-[78%] overflow-hidden rounded-[0.8rem] border", sampleStyle.paper, isDark ? "border-white/10" : "border-black/5"].join(" ")}>
        <div className={["absolute inset-x-0 top-0 h-2.5", sampleStyle.chipStrong].join(" ")} />
        <div className={["absolute start-2 top-4 h-2 w-12 rounded-full", sampleStyle.chipStrong].join(" ")} />
        <div className={["absolute start-2 top-9 h-1.5 w-10 rounded-full opacity-75", sampleStyle.chip].join(" ")} />
        <div className={["absolute end-2 top-4 h-8 w-8 rounded-full", sampleStyle.chip].join(" ")} />
        <div className={["absolute inset-x-2 bottom-2 space-y-1 rounded-[0.55rem] border p-2", sampleStyle.panel].join(" ")}>
          <div className={["h-1.5 w-[82%] rounded-full", sampleStyle.chipStrong].join(" ")} />
          <div className={["h-1.5 w-[54%] rounded-full", sampleStyle.chip].join(" ")} />
        </div>
      </div>
    );
  }

  if (id === "compact") {
    return (
      <div className={["relative h-[72%] w-[78%] overflow-hidden rounded-[0.8rem] border p-2", sampleStyle.paper, isDark ? "border-white/10" : "border-black/5"].join(" ")}>
        <div className={["absolute start-2 top-2 h-10 w-10 rounded-xl", sampleStyle.chipStrong].join(" ")} />
        <div className="absolute start-14 top-3 right-2 space-y-2">
          <div className={["h-2.5 w-16 rounded-full", sampleStyle.chipStrong].join(" ")} />
          <div className={["h-1.5 w-12 rounded-full", sampleStyle.chip].join(" ")} />
        </div>
        <div className={["absolute inset-x-2 bottom-2 space-y-1 rounded-[0.5rem] border p-2", sampleStyle.panel].join(" ")}>
          <div className={["h-1.5 w-full rounded-full", sampleStyle.chipStrong].join(" ")} />
          <div className={["h-1.5 w-[84%] rounded-full", sampleStyle.chip].join(" ")} />
          <div className={["h-1.5 w-[64%] rounded-full", sampleStyle.chip].join(" ")} />
        </div>
      </div>
    );
  }

  return (
    <div className={["relative h-[72%] w-[78%] overflow-hidden rounded-[0.8rem] border", sampleStyle.paper, isDark ? "border-white/10" : "border-black/5"].join(" ")}>
      <div className={["absolute inset-y-2 start-2 w-2.5 rounded-full", sampleStyle.chipStrong].join(" ")} />
      <div className={["absolute start-7 top-3 h-2.5 w-16 rounded-full", sampleStyle.chipStrong].join(" ")} />
      <div className={["absolute start-7 top-7 h-1.5 w-12 rounded-full", sampleStyle.chip].join(" ")} />
      <div className={["absolute end-2 top-3 h-10 w-10 rounded-full", sampleStyle.chip].join(" ")} />
      <div className={["absolute inset-x-7 bottom-2 space-y-1 rounded-[0.5rem] border p-2", sampleStyle.panel].join(" ")}>
        <div className={["h-1.5 w-[76%] rounded-full", sampleStyle.chipStrong].join(" ")} />
        <div className={["h-1.5 w-[42%] rounded-full", sampleStyle.chip].join(" ")} />
      </div>
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
