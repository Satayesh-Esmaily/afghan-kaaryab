"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { Badge, ConfirmDialog, EmptyState, SectionHeading } from "@/components/ui";
import {
  formatDeadline,
  formatPublishedDate,
  getOpportunityById,
  isExpiringSoon,
} from "@/lib/opportunities";
import {
  opportunityCategoryLabelKeys,
  opportunityGenderLabelKeys,
  opportunityLevelLabelKeys,
  opportunityTypeLabelKeys,
} from "@/lib/opportunity-labels";
import { slugifyOrganizationName } from "@/lib/network";

export default function OpportunityDetails() {
  const t = useTranslations("opportunities.details");
  const tShared = useTranslations("opportunities.shared");
  const locale = useLocale();
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { opportunities, isSaved, toggleSaved, deleteOpportunity } = useOpportunitiesContext();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const opportunity = id ? getOpportunityById(opportunities, id) : undefined;

  if (!opportunity) {
    return (
      <EmptyState
        title={t("notFoundTitle")}
        description={t("notFoundDescription")}
        actionHref={`/${locale}/opportunities`}
        actionLabel={t("backToOpportunities")}
      />
    );
  }

  const saved = isSaved(opportunity.id);
  const organizationSlug = slugifyOrganizationName(opportunity.organization);

  return (
    <div className="space-y-8">
      <section className="rounded-[1.5rem] panel p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{tShared(opportunityCategoryLabelKeys[opportunity.category])}</Badge>
          <Badge tone={isExpiringSoon(opportunity.deadline) ? "warning" : "default"}>
            {isExpiringSoon(opportunity.deadline) ? t("deadlineSoon") : t("openPosition")}
          </Badge>
          <Badge tone={opportunity.type === "Remote" ? "success" : "default"}>
            {tShared(opportunityTypeLabelKeys[opportunity.type])}
          </Badge>
          {opportunity.level ? <Badge tone="accent">{tShared(opportunityLevelLabelKeys[opportunity.level])}</Badge> : null}
          {opportunity.gender ? <Badge tone="default">{tShared(opportunityGenderLabelKeys[opportunity.gender])}</Badge> : null}
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div className="space-y-4">
            <SectionHeading title={opportunity.title} description={opportunity.organization} />
            <p className="ds-muted text-base leading-7">{opportunity.description}</p>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard label={t("organizationLabel")} value={opportunity.organization} />
              <InfoCard label={t("provinceLabel")} value={opportunity.location} />
              <InfoCard
                label={t("publishedLabel")}
                value={formatPublishedDate(opportunity.publishedAt ?? opportunity.submittedAt)}
              />
              <InfoCard label={t("deadlineLabel")} value={formatDeadline(opportunity.deadline)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <button
              type="button"
              onClick={() => toggleSaved(opportunity.id)}
              className="ds-button-secondary rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              {saved ? t("removeSaved") : t("saveOpportunity")}
            </button>
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noreferrer"
              className="ds-button-primary rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              {t("apply")}
            </a>
            <Link
              href={`/${locale}/opportunities/${opportunity.id}/edit`}
              className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
            >
              {t("edit")}
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full border border-transparent bg-[color:var(--danger-soft)] px-5 py-3 text-sm font-semibold text-[color:var(--danger)] transition hover:opacity-90"
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <DetailPanel title={t("description")}>
            <p className="ds-muted text-sm leading-7">{opportunity.description}</p>
          </DetailPanel>

          <DetailPanel title={t("responsibilities")}>
            <DetailList
              items={
                opportunity.responsibilities ?? [
                  t("responsibilityReview"),
                  t("responsibilityTailored"),
                  t("responsibilityInstructions"),
                ]
              }
            />
          </DetailPanel>

          <DetailPanel title={t("requirements")}>
            <DetailList items={opportunity.requirements} />
          </DetailPanel>

          <DetailPanel title={t("skills")}>
            <TagList items={opportunity.skills ?? opportunity.tags} />
          </DetailPanel>

          <DetailPanel title={t("documentsRequired")}>
            <DetailList
              items={
                opportunity.documentsRequired ?? [
                  t("documentCv"),
                  t("documentCoverLetter"),
                  t("documentCertificates"),
                ]
              }
            />
          </DetailPanel>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              {t("companyInfo")}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground-strong)]">
              {opportunity.organization}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-muted)]">
              {opportunity.companySummary ?? t("companySummaryFallback")}
            </p>

            <div className="mt-5 space-y-3">
              <MetaRow label={t("location")} value={opportunity.location} />
              <MetaRow label={t("contract")} value={tShared(opportunityTypeLabelKeys[opportunity.type])} />
              <MetaRow
                label={t("level")}
                value={opportunity.level ? tShared(opportunityLevelLabelKeys[opportunity.level]) : t("notSpecified")}
              />
              <MetaRow
                label={t("gender")}
                value={opportunity.gender ? tShared(opportunityGenderLabelKeys[opportunity.gender]) : t("openToAll")}
              />
              <MetaRow label={t("organizationPage")} value={organizationSlug} />
            </div>

            <Link
              href={`/${locale}/organizations/${organizationSlug}`}
              className="mt-5 inline-flex rounded-full bg-[color:var(--accent-soft)] px-4 py-2.5 text-sm font-semibold text-[color:var(--accent-strong)] transition hover:bg-[color:var(--accent-soft)]/80"
            >
              {t("viewOrganization")}
            </Link>
          </div>

          <div className="rounded-[1.5rem] accent-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              {t("applicationNote")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{t("applicationNoteTitle")}</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">{t("applicationNoteDescription")}</p>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteConfirm")}
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteOpportunity(opportunity.id);
          setDeleteOpen(false);
          router.push(`/${locale}/opportunities`);
        }}
      />
    </div>
  );
}

function DetailPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] panel p-6">
      <h2 className="text-xl font-semibold text-[color:var(--foreground-strong)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)]"
        >
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--success-soft)] text-xs font-bold text-[color:var(--success)]">
            OK
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--foreground-strong)]">{value}</p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-[color:var(--foreground-muted)]">{label}</span>
      <span className="max-w-[65%] text-end text-sm font-semibold text-[color:var(--foreground-strong)]">
        {value}
      </span>
    </div>
  );
}
