"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { EmptyState, SectionHeading, StatCard } from "@/components/ui";
import { useOpportunitiesContext } from "@/context/opportunities-context";

export default function SavedOpportunitiesView() {
  const t = useTranslations("opportunities.saved");
  const { opportunities, savedIds, clearSaved } = useOpportunitiesContext();
  const saved = opportunities.filter((opportunity) => savedIds.includes(opportunity.id));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t("savedItems")} value={saved.length} tone="info" />
        <StatCard label={t("availableOpportunities")} value={opportunities.length} tone="accent" />
        <StatCard label={t("quickAction")} value={t("saveMore")} hint={t("tapStar")} tone="success" />
      </div>

      {saved.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="ds-muted text-sm leading-6">{t("removeItemsHint")}</p>
            <button
              type="button"
              onClick={clearSaved}
              className="ds-button-secondary shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              {t("clearSaved")}
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {saved.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={t("nothingSaved")}
          description={t("exploreOpportunities")}
          actionHref="/opportunities"
          actionLabel={t("explore")}
        />
      )}

      <div className="ds-card rounded-[1.5rem] border-[color:var(--accent-soft)] bg-[linear-gradient(180deg,rgba(241,239,255,0.7),var(--surface))] p-6">
        <p className="ds-muted text-sm">
          {t("needFreshStart")}{" "}
          <Link className="font-semibold text-[color:var(--accent-strong)] underline-offset-4 hover:underline" href="/opportunities">
            {t("fullOpportunityList")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
