"use client";

import { useMemo, useState } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { Badge, EmptyState } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import {
  matchesDeadlineFilter,
  matchesPublishedAfterFilter,
  opportunityCategories,
  opportunityLevels,
  opportunityTypes,
  type DeadlineFilter,
  type Opportunity,
} from "@/lib/opportunities";

type GenderFilter = "Any" | "Male" | "Female" | "Open to all";
type LevelFilter = "Any" | (typeof opportunityLevels)[number];

export default function OpportunityBrowser({ opportunities }: { opportunities: Opportunity[] }) {
  const { savedIds, opportunities: storedOpportunities, hydrated } = useAppData();
  const activeOpportunities = hydrated ? storedOpportunities : opportunities;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof opportunityCategories)[number] | "All">("All");
  const [location, setLocation] = useState("All");
  const [company, setCompany] = useState("All");
  const [type, setType] = useState<(typeof opportunityTypes)[number] | "All">("All");
  const [publishedAfter, setPublishedAfter] = useState("");
  const [gender, setGender] = useState<GenderFilter>("Any");
  const [level, setLevel] = useState<LevelFilter>("Any");
  const [deadline, setDeadline] = useState<DeadlineFilter>("all");

  const locationOptions = useMemo(
    () => ["All", ...new Set(activeOpportunities.map((item) => item.location))],
    [activeOpportunities]
  );
  const companyOptions = useMemo(
    () => ["All", ...new Set(activeOpportunities.map((item) => item.organization))],
    [activeOpportunities]
  );

  const filtered = activeOpportunities
    .filter((opportunity) => {
      const searchTarget = [
        opportunity.title,
        opportunity.organization,
        opportunity.location,
        opportunity.description,
        opportunity.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchTarget.includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || opportunity.category === category;
      const matchesLocation = location === "All" || opportunity.location === location;
      const matchesCompany = company === "All" || opportunity.organization === company;
      const matchesType = type === "All" || opportunity.type === type;
      const matchesDeadline = matchesDeadlineFilter(opportunity.deadline, deadline);
      const matchesPublished = matchesPublishedAfterFilter(
        opportunity.publishedAt ?? opportunity.submittedAt,
        publishedAfter
      );
      const matchesGender =
        gender === "Any" || opportunity.gender === gender || (gender === "Open to all" && !opportunity.gender);
      const matchesLevel = level === "Any" || opportunity.level === level;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLocation &&
        matchesCompany &&
        matchesType &&
        matchesDeadline &&
        matchesPublished &&
        matchesGender &&
        matchesLevel
      );
    })
    .sort((a, b) => {
      const aDate = new Date(a.publishedAt ?? a.submittedAt ?? a.deadline).getTime();
      const bDate = new Date(b.publishedAt ?? b.submittedAt ?? b.deadline).getTime();
      return bDate - aDate;
    });

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setLocation("All");
    setCompany("All");
    setType("All");
    setPublishedAfter("");
    setGender("Any");
    setLevel("Any");
    setDeadline("all");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="space-y-5 rounded-[1.5rem] panel p-5 sm:p-6 xl:sticky xl:top-24 xl:h-fit">
        <div className="space-y-2">
          <Badge tone="default">Search filters</Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
            Find the right job faster
          </h2>
          <p className="text-sm leading-7 text-[color:var(--foreground-muted)]">
            Search by title, province, company, contract type, publication date, gender, and level.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Search title
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities..."
              className="ds-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Province
            </span>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="ds-input">
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Company
            </span>
            <select value={company} onChange={(event) => setCompany(event.target.value)} className="ds-input">
              {companyOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Contract type
            </span>
            <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="ds-input">
              <option value="All">All</option>
              {opportunityTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Published after
            </span>
            <input
              type="date"
              value={publishedAfter}
              onChange={(event) => setPublishedAfter(event.target.value)}
              className="ds-input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Gender
            </span>
            <select value={gender} onChange={(event) => setGender(event.target.value as GenderFilter)} className="ds-input">
              <option value="Any">Any</option>
              <option value="Open to all">Open to all</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">
              Job level
            </span>
            <select value={level} onChange={(event) => setLevel(event.target.value as LevelFilter)} className="ds-input">
              <option value="Any">Any</option>
              {opportunityLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-4 border-t border-[color:var(--border)] pt-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[color:var(--foreground-muted)]">Deadline</span>
            <Badge tone="info">{filtered.length} results</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Any" },
              { value: "7", label: "7 days" },
              { value: "14", label: "14 days" },
              { value: "30", label: "30 days" },
              { value: "expired", label: "Expired" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setDeadline(item.value as DeadlineFilter)}
                className={[
                  "rounded-full px-3 py-2 text-xs font-semibold transition",
                  deadline === item.value
                    ? "active-pill"
                    : "inactive-pill hover:bg-[color:var(--surface-soft)]",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
          >
            Clear filters
          </button>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">
              Opportunity search
            </p>
            <h2 className="ds-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {filtered.length} opportunities
            </h2>
            <p className="ds-muted mt-2 text-sm leading-6">
              Browse the latest listings with a clean layout and useful filters.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="default">{savedIds.length} saved</Badge>
            <Badge tone="success">{activeOpportunities.length} total</Badge>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filtered.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No opportunities match your filters"
            description="Try a different company, widen the date range, or clear the filters to see more results."
            actionHref="/add-opportunity"
            actionLabel="Submit a new opportunity"
          />
        )}
      </section>
    </div>
  );
}
