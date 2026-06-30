"use client";

import { useState } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { EmptyState, Badge } from "@/components/ui";
import {
  deadlineFilters,
  matchesDeadlineFilter,
  opportunityCategories,
  opportunityTypes,
  type DeadlineFilter,
  type Opportunity,
} from "@/lib/opportunities";

export default function OpportunityBrowser({ opportunities }: { opportunities: Opportunity[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof opportunityCategories)[number] | "All">("All");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState<(typeof opportunityTypes)[number] | "All">("All");
  const [deadline, setDeadline] = useState<DeadlineFilter>("all");

  const locationOptions = ["All", ...new Set(opportunities.map((item) => item.location))];
  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setLocation("All");
    setType("All");
    setDeadline("all");
  };

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

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-5">
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
              Search by title, organization, or tags
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities..."
              className="filter-input"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as typeof category)}
              className="filter-input"
            >
              <option value="All">All</option>
              {opportunityCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Location</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="filter-input">
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              className="filter-input"
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
                "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                deadline === item.value
                  ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Badge tone="success">{filtered.length} results</Badge>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
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

      <style jsx global>{`
        .filter-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: rgb(15 23 42);
          outline: none;
        }

        .dark .filter-input {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: rgb(248 250 252);
        }

        .filter-input:focus {
          border-color: rgb(34 211 238);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.18);
        }
      `}</style>
    </div>
  );
}
