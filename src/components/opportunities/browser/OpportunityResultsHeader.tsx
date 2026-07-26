"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui";

type OpportunityResultsHeaderProps = {
  count: number;
  savedCount: number;
  totalCount: number;
};

export function OpportunityResultsHeader({ count, savedCount, totalCount }: OpportunityResultsHeaderProps) {
  const t = useTranslations("opportunities.results");

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">{t("eyebrow")}</p>
        <h2 className="ds-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t("title", { count })}</h2>
        <p className="ds-muted mt-2 text-sm leading-6">{t("description")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="default">{t("saved", { count: savedCount })}</Badge>
        <Badge tone="success">{t("total", { count: totalCount })}</Badge>
      </div>
    </div>
  );
}
