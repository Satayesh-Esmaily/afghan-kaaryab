"use client";

import { Badge } from "@/components/ui";

type OpportunityResultsHeaderProps = {
  count: number;
  savedCount: number;
  totalCount: number;
};

export function OpportunityResultsHeader({ count, savedCount, totalCount }: OpportunityResultsHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">Opportunity search</p>
        <h2 className="ds-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{count} opportunities</h2>
        <p className="ds-muted mt-2 text-sm leading-6">Browse the latest listings with a clean layout and useful filters.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="default">{savedCount} saved</Badge>
        <Badge tone="success">{totalCount} total</Badge>
      </div>
    </div>
  );
}
