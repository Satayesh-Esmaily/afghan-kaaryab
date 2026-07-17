"use client";

import { useMemo, useState } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui";
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
import {
  GenderFilter,
  LevelFilter,
  OpportunityFilterSidebar,
} from "@/components/opportunities/browser/OpportunityFilterSidebar";
import { OpportunityResultsHeader } from "@/components/opportunities/browser/OpportunityResultsHeader";

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
      <OpportunityFilterSidebar
        query={query}
        onQueryChange={setQuery}
        location={location}
        onLocationChange={setLocation}
        company={company}
        onCompanyChange={setCompany}
        type={type}
        onTypeChange={setType}
        publishedAfter={publishedAfter}
        onPublishedAfterChange={setPublishedAfter}
        gender={gender}
        onGenderChange={setGender}
        level={level}
        onLevelChange={setLevel}
        deadline={deadline}
        onDeadlineChange={setDeadline}
        resultCount={filtered.length}
        locationOptions={locationOptions}
        companyOptions={companyOptions}
        onClearFilters={clearFilters}
      />

      <section className="space-y-5">
        <OpportunityResultsHeader count={filtered.length} savedCount={savedIds.length} totalCount={activeOpportunities.length} />

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
