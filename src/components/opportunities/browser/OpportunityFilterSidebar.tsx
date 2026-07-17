"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { opportunityLevels, opportunityTypes, type DeadlineFilter } from "@/lib/opportunities";

export type GenderFilter = "Any" | "Male" | "Female" | "Open to all";
export type LevelFilter = "Any" | (typeof opportunityLevels)[number];

type OpportunityFilterSidebarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  company: string;
  onCompanyChange: (value: string) => void;
  type: string;
  onTypeChange: (value: (typeof opportunityTypes)[number] | "All") => void;
  publishedAfter: string;
  onPublishedAfterChange: (value: string) => void;
  gender: GenderFilter;
  onGenderChange: (value: GenderFilter) => void;
  level: LevelFilter;
  onLevelChange: (value: LevelFilter) => void;
  deadline: DeadlineFilter;
  onDeadlineChange: (value: DeadlineFilter) => void;
  resultCount: number;
  locationOptions: string[];
  companyOptions: string[];
  onClearFilters: () => void;
};

const deadlineOptions: Array<{ value: DeadlineFilter; label: string }> = [
  { value: "all", label: "Any" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "expired", label: "Expired" },
];

export function OpportunityFilterSidebar({
  query,
  onQueryChange,
  location,
  onLocationChange,
  company,
  onCompanyChange,
  type,
  onTypeChange,
  publishedAfter,
  onPublishedAfterChange,
  gender,
  onGenderChange,
  level,
  onLevelChange,
  deadline,
  onDeadlineChange,
  resultCount,
  locationOptions,
  companyOptions,
  onClearFilters,
}: OpportunityFilterSidebarProps) {
  return (
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
        <FilterSelect label="Search title">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search opportunities..."
            className="ds-input"
          />
        </FilterSelect>

        <FilterSelect label="Province">
          <select value={location} onChange={(event) => onLocationChange(event.target.value)} className="ds-input">
            {locationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FilterSelect>

        <FilterSelect label="Company">
          <select value={company} onChange={(event) => onCompanyChange(event.target.value)} className="ds-input">
            {companyOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FilterSelect>

        <FilterSelect label="Contract type">
          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value as (typeof opportunityTypes)[number] | "All")}
            className="ds-input"
          >
            <option value="All">All</option>
            {opportunityTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FilterSelect>

        <FilterSelect label="Published after">
          <input
            type="date"
            value={publishedAfter}
            onChange={(event) => onPublishedAfterChange(event.target.value)}
            className="ds-input"
          />
        </FilterSelect>

        <FilterSelect label="Gender">
          <select value={gender} onChange={(event) => onGenderChange(event.target.value as GenderFilter)} className="ds-input">
            <option value="Any">Any</option>
            <option value="Open to all">Open to all</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </FilterSelect>

        <FilterSelect label="Job level">
          <select value={level} onChange={(event) => onLevelChange(event.target.value as LevelFilter)} className="ds-input">
            <option value="Any">Any</option>
            {opportunityLevels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FilterSelect>
      </div>

      <div className="space-y-4 border-t border-[color:var(--border)] pt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-[color:var(--foreground-muted)]">Deadline</span>
          <Badge tone="info">{resultCount} results</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {deadlineOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onDeadlineChange(item.value)}
              className={[
                "rounded-full px-3 py-2 text-xs font-semibold transition",
                deadline === item.value ? "active-pill" : "inactive-pill hover:bg-[color:var(--surface-soft)]",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}

function FilterSelect({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[color:var(--foreground-strong)]">{label}</span>
      {children}
    </label>
  );
}
