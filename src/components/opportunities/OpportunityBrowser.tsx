"use client";

import { useMemo, useState } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { EmptyState, Badge } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import {
  deadlineFilters,
  matchesDeadlineFilter,
  opportunityCategories,
  opportunityTypes,
  type DeadlineFilter,
  type Opportunity,
} from "@/lib/opportunities";

export default function OpportunityBrowser({ opportunities }: { opportunities: Opportunity[] }) {
  const { savedIds } = useAppData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof opportunityCategories)[number] | "All">("All");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState<(typeof opportunityTypes)[number] | "All">("All");
  const [deadline, setDeadline] = useState<DeadlineFilter>("all");

  const locationOptions = useMemo(
    () => ["All", ...new Set(opportunities.map((item) => item.location))],
    [opportunities]
  );

  const filtered = opportunities.filter((opportunity) => {
    const searchTarget = [
      opportunity.title,
      opportunity.organization,
      opportunity.description,
      opportunity.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = searchTarget.includes(query.trim().toLowerCase());
    const matchesCategory = category === "All" || opportunity.category === category;
    const matchesLocation = location === "All" || opportunity.location === location;
    const matchesType = type === "All" || opportunity.type === type;
    const matchesDeadline = matchesDeadlineFilter(opportunity.deadline, deadline);

    return matchesQuery && matchesCategory && matchesLocation && matchesType && matchesDeadline;
  });

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setLocation("All");
    setType("All");
    setDeadline("all");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2.25rem] accent-panel p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <Badge tone="default">Demo Data</Badge>
            <div className="space-y-3">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore opportunities that move your career forward
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
                Search jobs, internships, scholarships, remote roles, and skill-building
                opportunities in a clean discover experience built for Afghan youth.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Listings" value={opportunities.length} />
              <HeroStat label="Saved" value={savedIds.length} />
              <HeroStat label="Categories" value={opportunityCategories.length} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] panel px-5 py-5">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-black/10" />
            <div className="relative space-y-4">
              <div className="rounded-[1.5rem] panel px-4 py-4 text-[color:var(--foreground)]">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">What users can do</p>
                <ul className="mt-3 space-y-2 text-sm text-[color:var(--foreground)]">
                  <li>Search by title, organization, or tag</li>
                  <li>Filter by category, location, type, and deadline</li>
                  <li>Save opportunities for later review</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] panel px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Presentation tip</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Mention that this is a demo-friendly platform with localStorage persistence and
                  full CRUD actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <CategoryPill active={category === "All"} onClick={() => setCategory("All")}>
          All
        </CategoryPill>
        {opportunityCategories.map((item) => (
          <CategoryPill key={item} active={category === item} onClick={() => setCategory(item)}>
            {item}
          </CategoryPill>
        ))}
      </div>

      <section className="rounded-[2rem] panel p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities..."
              className="soft-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Location
            </span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="soft-input"
            >
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Opportunity type
            </span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              className="soft-input"
            >
              <option value="All">All</option>
              {opportunityTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Deadline</span>
          {deadlineFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDeadline(item.value)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                deadline === item.value ? "active-pill" : "inactive-pill hover:bg-slate-100 dark:hover:bg-white/5",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <Badge tone="success">{filtered.length} results</Badge>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full panel px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {filtered.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No opportunities match your filters"
          description="Try a broader keyword, switch the category, or clear the deadline filter to find more opportunities."
          actionHref="/add-opportunity"
          actionLabel="Submit a new opportunity"
        />
      )}

    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-white/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CategoryPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium transition",
        active ? "active-pill" : "inactive-pill hover:bg-slate-100 dark:hover:bg-white/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
