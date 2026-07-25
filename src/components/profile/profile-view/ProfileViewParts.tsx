"use client";

import type { ReactNode, RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui";
import type { AwardEntry, CertificationEntry, DocumentEntry, EducationEntry, ExperienceEntry } from "@/lib/app-state";
import {
  formatDateLabel,
  formatDateRangeLocalized,
  getInitials,
  splitItems,
} from "@/components/profile/profile-view/profile-view-helpers";

type ResumeTabProps = {
  resumeInputRef: RefObject<HTMLInputElement | null>;
  resumeFiles: string[];
  resumeUploadBusy: boolean;
  resumeUploadError: string;
  onPickFiles: () => void;
  onFilesChange: (files: File[]) => void | Promise<void>;
  onDeleteFile: () => void | Promise<void>;
  onDownloadFile: () => void | Promise<void>;
};

type ProfileSectionProps = {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
};

type ProfileValueBoxProps = {
  label: string;
  value: string;
};

type EntriesHeaderProps = {
  actionLabel: string;
  onAction: () => void;
};

type EmptyListCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

type ExperienceCardProps = {
  entry: ExperienceEntry;
  onEdit: () => void;
  onDelete: () => void;
};

type EducationCardProps = {
  entry: EducationEntry;
  onEdit: () => void;
  onDelete: () => void;
};

type CertificationCardProps = {
  entry: CertificationEntry;
  onEdit: () => void;
  onDelete: () => void;
};

type AwardCardProps = {
  entry: AwardEntry;
  onEdit: () => void;
  onDelete: () => void;
};

type DocumentCardProps = {
  entry: DocumentEntry;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
};

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

type ActionChipProps = {
  label: string;
  onClick: () => void;
};

export function ResumeTab({
  resumeInputRef,
  resumeFiles,
  resumeUploadBusy,
  resumeUploadError,
  onPickFiles,
  onFilesChange,
  onDeleteFile,
  onDownloadFile,
}: ResumeTabProps) {
  const t = useTranslations("profile.resume");

  return (
    <section className="rounded-[1.75rem] panel p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{t("title")}</h2>
          <p className="text-sm leading-6 text-[color:var(--foreground-muted)]">{t("description")}</p>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-4 rounded-[1.25rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <button type="button" onClick={onPickFiles} className="flex items-center gap-3 text-start">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[color:var(--foreground-muted)]">
                <PlusIcon />
              </span>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {resumeUploadBusy ? t("uploading") : t("uploadPrompt")}
              </span>
            </button>

            <p className="text-end text-xs font-medium leading-5 text-[color:var(--foreground-muted)]">
              {t("allowedTypes")}
              <br />
              {t("maxSize")}
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
                    aria-label={t("deleteFile", { fileName })}
                    onClick={() => void onDeleteFile()}
                  >
                    <TrashIcon />
                  </button>
                  <button
                    type="button"
                    className="hover:text-[color:var(--foreground)]"
                    aria-label={t("downloadFile", { fileName })}
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

export function ProfileSection({ title, description, badge, children }: ProfileSectionProps) {
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

export function ProfileValueBox({ label, value }: ProfileValueBoxProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[color:var(--foreground)]">{label}</p>
      <div className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground-muted)]">
        {value}
      </div>
    </div>
  );
}

export function EntriesHeader({ actionLabel, onAction }: EntriesHeaderProps) {
  const t = useTranslations("profile.common");

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="max-w-2xl text-sm text-[color:var(--foreground-muted)]">{t("entriesHeaderHint")}</div>
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

export function EmptyListCard({ title, description, actionLabel, onAction }: EmptyListCardProps) {
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

export function ExperienceCard({ entry, onEdit, onDelete }: ExperienceCardProps) {
  const t = useTranslations("profile.experience");
  const locale = useLocale();

  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.organization || entry.position)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">{entry.position}</p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.organization}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {formatDateRangeLocalized(entry.startDate, entry.endDate, entry.currentlyWorking, locale, t("present"), t("dateNotAdded"))}
            </p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {entry.country}
              {entry.province ? ` · ${entry.province}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label={t("edit")} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={t("delete")} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p>

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

export function EducationCard({ entry, onEdit, onDelete }: EducationCardProps) {
  const t = useTranslations("profile.education");
  const locale = useLocale();

  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--foreground-strong)]">
            {getInitials(entry.institution || entry.degree)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[color:var(--foreground-strong)]">{entry.degree}</p>
            <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{entry.institution}</p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {formatDateRangeLocalized(entry.startDate, entry.endDate, false, locale, t("present"), t("dateNotAdded"))}
            </p>
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
              {entry.fieldOfStudy}
              {entry.country ? ` · ${entry.country}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label={t("edit")} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={t("delete")} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}
    </article>
  );
}

export function CertificationCard({ entry, onEdit, onDelete }: CertificationCardProps) {
  const t = useTranslations("profile.certifications");
  const locale = useLocale();

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
              {t("issued")} {formatDateLabel(entry.issueDate, locale)}
              {entry.expirationDate ? ` · ${t("expires")} ${formatDateLabel(entry.expirationDate, locale)}` : ""}
            </p>
            {entry.credentialId ? (
              <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
                {t("credentialId")}: {entry.credentialId}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label={t("edit")} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={t("delete")} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.certificationUrl ? (
          <ActionChip label={t("openLink")} onClick={() => window.open(entry.certificationUrl, "_blank", "noopener,noreferrer")} />
        ) : null}
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || t("openAttachment")}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

export function AwardCard({ entry, onEdit, onDelete }: AwardCardProps) {
  const t = useTranslations("profile.awards");
  const locale = useLocale();

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
            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">{formatDateLabel(entry.date, locale)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[color:var(--foreground-muted)]">
          <IconButton label={t("edit")} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={t("delete")} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.referenceUrl ? (
          <ActionChip label={t("openLink")} onClick={() => window.open(entry.referenceUrl, "_blank", "noopener,noreferrer")} />
        ) : null}
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || t("openAttachment")}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

export function DocumentCard({ entry, onEdit, onDelete }: DocumentCardProps) {
  const t = useTranslations("profile.documents");

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
          <IconButton label={t("edit")} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={t("delete")} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {entry.description ? <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">{entry.description}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.attachmentUrl ? (
          <ActionChip
            label={entry.attachmentFileName || t("openAttachment")}
            onClick={() => window.open(entry.attachmentUrl, "_blank", "noopener,noreferrer")}
          />
        ) : null}
      </div>
    </article>
  );
}

function IconButton({ label, onClick, children }: IconButtonProps) {
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

function ActionChip({ label, onClick }: ActionChipProps) {
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
