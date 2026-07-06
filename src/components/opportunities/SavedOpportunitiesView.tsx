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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You can remove items from here or from the opportunity details page.
            </p>
            <button
              type="button"
              onClick={clearSaved}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Clear saved
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
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

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Need a fresh start? You can always return to the{" "}
          <Link className="font-semibold text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-300" href="/opportunities">
            full opportunity list
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
