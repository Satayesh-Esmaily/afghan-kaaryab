import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardView from "@/components/dashboard/DashboardView";
import type { Opportunity } from "@/lib/opportunities";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("status=welcome"),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/context/auth-context", () => ({
  useAuthContext: () => ({
    user: { displayName: "Amina" },
  }),
}));

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    opportunities: [
      {
        id: "1",
        title: "Frontend Developer",
        organization: "KaarYab",
        category: "Job",
        location: "Kabul",
        type: "Remote",
        deadline: "2026-08-15",
        description: "Build front-end experiences.",
        requirements: [],
        tags: [],
      } satisfies Opportunity,
    ],
  }),
}));

vi.mock("@/components/dashboard/sections/DashboardHeroSection", () => ({
  default: ({ savedCount, userName, stats }: { savedCount: number; userName?: string; stats: { total: number } }) => (
    <div data-testid="hero">{`${userName ?? "Guest"}:${savedCount}:${stats.total}`}</div>
  ),
}));

vi.mock("@/components/dashboard/sections/DashboardCalendarSection", () => ({
  default: () => <div data-testid="calendar">calendar</div>,
}));

vi.mock("@/components/dashboard/sections/DashboardOpportunityStatsSection", () => ({
  default: ({ stats }: { stats: { total: number } }) => <div data-testid="stats">{stats.total}</div>,
}));

vi.mock("@/components/dashboard/sections/DashboardCategoryBreakdownSection", () => ({
  default: ({ categories }: { categories: Array<{ label: string; value: number }> }) => (
    <div data-testid="categories">{categories.length}</div>
  ),
}));

vi.mock("@/components/dashboard/sections/DashboardRecentSubmissionsSection", () => ({
  default: ({ recent }: { recent: Array<{ id: string }> }) => <div data-testid="recent">{recent.length}</div>,
}));

vi.mock("@/components/dashboard/sections/DashboardQuickInsightSection", () => ({
  default: () => <div data-testid="insight">insight</div>,
}));

describe("DashboardView", () => {
  it("renders the welcome banner and the main dashboard sections", () => {
    render(<DashboardView />);

    expect(screen.getByText("welcomeBanner.title, Amina.")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toHaveTextContent("Amina");
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
    expect(screen.getByTestId("stats")).toHaveTextContent("1");
    expect(screen.getByTestId("categories")).toHaveTextContent("7");
    expect(screen.getByTestId("recent")).toBeInTheDocument();
    expect(screen.getByTestId("insight")).toBeInTheDocument();
  });
});
