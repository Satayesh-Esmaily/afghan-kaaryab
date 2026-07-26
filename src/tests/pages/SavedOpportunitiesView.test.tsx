import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SavedOpportunitiesView from "@/components/opportunities/SavedOpportunitiesView";
import type { Opportunity } from "@/lib/opportunities";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const clearSavedMock = vi.fn();

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    opportunities: [
      {
        id: "1",
        title: "Alpha Developer",
        organization: "KaarYab",
        category: "Job",
        location: "Kabul",
        type: "Remote",
        deadline: "2026-08-15",
        description: "Build alpha products.",
        requirements: [],
        tags: [],
      } satisfies Opportunity,
      {
        id: "2",
        title: "Beta Analyst",
        organization: "Open Data",
        category: "Internship",
        location: "Herat",
        type: "On-site",
        deadline: "2026-08-20",
        description: "Analyze beta datasets.",
        requirements: [],
        tags: [],
      } satisfies Opportunity,
    ],
    savedIds: ["1"],
    clearSaved: clearSavedMock,
  }),
}));

vi.mock("@/components/opportunities/OpportunityCard", () => ({
  default: ({ opportunity }: { opportunity: Opportunity }) => <article>{opportunity.title}</article>,
}));

describe("SavedOpportunitiesView", () => {
  it("shows the saved items section and clear action", () => {
    render(<SavedOpportunitiesView />);

    expect(screen.getByText("savedItems")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "clearSaved" })).toBeInTheDocument();
    expect(screen.getByText("Alpha Developer")).toBeInTheDocument();
  });
});
