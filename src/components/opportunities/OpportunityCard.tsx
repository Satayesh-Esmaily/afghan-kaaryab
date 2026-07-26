"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { Badge } from "@/components/ui";
import {
  formatDeadline,
  formatPublishedDate,
  isExpiringSoon,
  type Opportunity,
} from "@/lib/opportunities";
import {
  opportunityCategoryLabelKeys,
  opportunityGenderLabelKeys,
  opportunityLevelLabelKeys,
  opportunityTypeLabelKeys,
} from "@/lib/opportunity-labels";

function colorForCategory(category: Opportunity["category"]) {
  switch (category) {
    case "Job":
      return "info";
    case "Scholarship":
      return "accent";
    case "Internship":
      return "success";
    case "Online course":
      return "warning";
    default:
      return "default";
  }
}

export default function OpportunityCard({
  opportunity,
  compact = false,
}: {
  opportunity: Opportunity;
  compact?: boolean;
}) {
  const t = useTranslations("opportunities.card");
  const tShared = useTranslations("opportunities.shared");
  const locale = useLocale();
  const router = useRouter();
  const { isSaved, toggleSaved } = useOpportunitiesContext();
  const saved = isSaved(opportunity.id);
  const detailsHref = `/${locale}/opportunities/${opportunity.id}`;

  return (
    <article
      className="group overflow-hidden rounded-[1.5rem] panel-strong transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
      role="link"
      tabIndex={0}
      onClick={() => router.push(detailsHref)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(detailsHref);
        }
      }}
    >
      <div className="relative overflow-hidden accent-panel p-5 sm:p-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute start-5 top-5 h-16 w-16 rounded-full border border-white/20" />
          <div className="absolute end-8 top-7 h-12 w-12 rounded-full border border-white/15" />
          <div className="absolute start-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full border border-dashed border-white/15" />
        </div>

        <div className="relative z-10 flex min-h-[210px] flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <Badge tone={colorForCategory(opportunity.category)}>
              {tShared(opportunityCategoryLabelKeys[opportunity.category])}
            </Badge>
            <div className="flex items-center gap-2">
              <Link
                href={detailsHref}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                aria-label={t("viewDetails")}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ↗
                </span>
              </Link>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSaved(opportunity.id);
                }}
                className={[
                  "inline-flex h-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold transition",
                  saved
                    ? "border-white/20 bg-white text-[color:var(--accent)] shadow-lg"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/20",
                ].join(" ")}
                aria-label={saved ? t("removeFromSaved") : t("save")}
              >
                {saved ? t("saved") : t("save")}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-white">
            <h3 className="text-[1.05rem] font-semibold leading-7 tracking-tight sm:text-[1.15rem]">
              {opportunity.title}
            </h3>
            <p className="text-sm font-medium text-white/80">{opportunity.organization}</p>
            <p className="max-w-[34ch] text-sm leading-6 text-white/85">
              {opportunity.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-center text-white sm:grid-cols-4">
            <Metric label={t("company")} value={opportunity.organization} />
            <Metric label={t("location")} value={opportunity.location} />
            <Metric label={t("published")} value={formatPublishedDate(opportunity.publishedAt ?? opportunity.submittedAt)} />
            <Metric label={t("deadline")} value={formatDeadline(opportunity.deadline)} />
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div
          className={[
            "h-1.5 w-16 rounded-full",
            colorForCategory(opportunity.category) === "info"
              ? "bg-[color:var(--accent)]"
              : colorForCategory(opportunity.category) === "success"
                ? "bg-[color:var(--success)]"
                : colorForCategory(opportunity.category) === "warning"
                  ? "bg-[color:var(--warning)]"
                  : "bg-[color:var(--border-strong)]",
          ].join(" ")}
        />

          <div className="flex flex-wrap items-center gap-2">
          {isExpiringSoon(opportunity.deadline) ? <Badge tone="warning">{t("expiringSoon")}</Badge> : null}
          <Badge tone="success">{tShared(opportunityTypeLabelKeys[opportunity.type])}</Badge>
          {opportunity.level ? <Badge tone="info">{tShared(opportunityLevelLabelKeys[opportunity.level])}</Badge> : null}
          {opportunity.gender ? <Badge tone="default">{tShared(opportunityGenderLabelKeys[opportunity.gender])}</Badge> : null}
          </div>

        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-medium text-[color:var(--foreground-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-3 sm:grid-cols-2">
          <Link
            href={detailsHref}
            onClick={(event) => event.stopPropagation()}
            className="ds-button-primary inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition"
          >
            {t("viewDetails")}
          </Link>
          <a
            href={opportunity.applyLink}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="ds-button-secondary inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition"
          >
            {t("applyNow")}
          </a>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{label}</p>
      <p className="mt-1 truncate text-[11px] font-medium leading-5 text-white">{value}</p>
    </div>
  );
}
