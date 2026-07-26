"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui";
import DatePickerField from "@/components/common/DatePickerField";
import SearchableSelect from "@/components/common/SearchableSelect";
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
  const t = useTranslations("opportunities.browser");
  const deadlineOptions: Array<{ value: DeadlineFilter; label: string }> = [
    { value: "all", label: t("any") },
    { value: "7", label: t("deadlineOptions.7") },
    { value: "14", label: t("deadlineOptions.14") },
    { value: "30", label: t("deadlineOptions.30") },
    { value: "expired", label: t("deadlineOptions.expired") },
  ];

  return (
    <aside className="space-y-5 rounded-[1.5rem] panel p-5 sm:p-6 xl:sticky xl:top-24 xl:h-fit">
      <div className="space-y-2">
        <Badge tone="default">{t("eyebrow")}</Badge>
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">{t("title")}</h2>
        <p className="text-sm leading-7 text-[color:var(--foreground-muted)]">{t("description")}</p>
      </div>

      <div className="grid gap-4">
        <FilterSelect label={t("searchTitle")}>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ds-input"
          />
        </FilterSelect>

        <FilterSelect label={t("province")}>
          <SearchableSelect
            value={location}
            options={locationOptions.map((item) => ({ value: item, label: item }))}
            placeholder={t("any")}
            searchPlaceholder={t("searchProvince")}
            onChange={onLocationChange}
          />
        </FilterSelect>

        <FilterSelect label={t("company")}>
          <SearchableSelect
            value={company}
            options={companyOptions.map((item) => ({ value: item, label: item }))}
            placeholder={t("any")}
            searchPlaceholder={t("searchCompany")}
            onChange={onCompanyChange}
          />
        </FilterSelect>

        <FilterSelect label={t("contractType")}>
          <SearchableSelect
            value={type}
            options={[{ value: "All", label: t("any") }, ...opportunityTypes.map((item) => ({ value: item, label: item }))]}
            placeholder={t("any")}
            searchPlaceholder={t("searchType")}
            onChange={(value) => onTypeChange(value as (typeof opportunityTypes)[number] | "All")}
          />
        </FilterSelect>

        <FilterSelect label={t("publishedAfter")}>
          <DatePickerField
            key={publishedAfter || "empty-published-after"}
            value={publishedAfter}
            onChange={onPublishedAfterChange}
            placeholder={t("anyDate")}
          />
        </FilterSelect>

        <FilterSelect label={t("gender")}>
          <SearchableSelect
            value={gender}
            options={[
              { value: "Any", label: t("any") },
              { value: "Open to all", label: t("openToAll") },
              { value: "Female", label: t("female") },
              { value: "Male", label: t("male") },
            ]}
            placeholder={t("any")}
            searchPlaceholder={t("searchGender")}
            onChange={(value) => onGenderChange(value as GenderFilter)}
          />
        </FilterSelect>

        <FilterSelect label={t("jobLevel")}>
          <SearchableSelect
            value={level}
            options={[{ value: "Any", label: t("any") }, ...opportunityLevels.map((item) => ({ value: item, label: item }))]}
            placeholder={t("any")}
            searchPlaceholder={t("searchLevel")}
            onChange={(value) => onLevelChange(value as LevelFilter)}
          />
        </FilterSelect>
      </div>

      <div className="space-y-4 border-t border-[color:var(--border)] pt-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-[color:var(--foreground-muted)]">{t("deadline")}</span>
          <Badge tone="info">{t("results", { count: resultCount })}</Badge>
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
          {t("clearFilters")}
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
