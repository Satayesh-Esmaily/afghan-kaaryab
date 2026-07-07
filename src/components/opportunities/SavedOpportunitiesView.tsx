"use client";

import Link from "next/link";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { EmptyState, SectionHeading, StatCard } from "@/components/ui";
import { useAppData } from "@/context/app-context";

export default function SavedOpportunitiesView() {
  const { opportunities, savedIds, clearSaved } = useAppData();
  const saved = opportunities.filter((opportunity) => savedIds.includes(opportunity.id));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Saved"
        title="Your saved opportunities"
        description="Keep the best opportunities in one place so you can return to them later."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Saved items" value={saved.length} tone="info" />
        <StatCard label="Available opportunities" value={opportunities.length} tone="accent" />
        <StatCard label="Quick action" value="Save more" hint="Tap the star on any card." tone="success" />
      </div>

      {saved.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="ds-muted text-sm leading-6">
              You can remove items from here or from the opportunity details page.
            </p>
            <button
              type="button"
              onClick={clearSaved}
              className="ds-button-secondary shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Clear saved
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
          title="Nothing saved yet"
          description="Browse the opportunities page and use the star button to save items for later."
          actionHref="/opportunities"
          actionLabel="Explore opportunities"
        />
      )}

      <div className="ds-card rounded-[1.5rem] border-[color:var(--accent-soft)] bg-[linear-gradient(180deg,rgba(241,239,255,0.7),var(--surface))] p-6">
        <p className="ds-muted text-sm">
          Need a fresh start? You can always return to the{" "}
          <Link className="font-semibold text-[color:var(--accent-strong)] underline-offset-4 hover:underline" href="/opportunities">
            full opportunity list
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
