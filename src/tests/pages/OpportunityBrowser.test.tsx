import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OpportunityBrowser from "@/components/opportunities/OpportunityBrowser";
import type { Opportunity } from "@/lib/opportunities";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/context/auth-context", () => ({
  useAuthContext: () => ({
    hydrated: true,
  }),
}));

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    savedIds: ["1"],
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
        tags: ["alpha"],
      },
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
        tags: ["beta"],
      } satisfies Opportunity,
    ],
  }),
}));

vi.mock("@/components/opportunities/OpportunityCard", () => ({
  default: ({ opportunity }: { opportunity: Opportunity }) => <article>{opportunity.title}</article>,
}));

describe("OpportunityBrowser", () => {
  it("filters the opportunity list by the search query", async () => {
    const user = userEvent.setup();

    render(<OpportunityBrowser opportunities={[]} />);

    expect(screen.getAllByRole("article")).toHaveLength(2);

    await user.type(screen.getByPlaceholderText("searchPlaceholder"), "alpha");

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Alpha Developer")).toBeInTheDocument();
    expect(screen.queryByText("Beta Analyst")).not.toBeInTheDocument();
  });
});
