import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import NetworkView from "@/components/network/NetworkView";
import type { Opportunity } from "@/lib/opportunities";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/context/auth-context", () => ({
  useAuthContext: () => ({
    hydrated: true,
  }),
}));

const toggleFollowMock = vi.fn();

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    followedOrganizationSlugs: ["kaaryab"],
    toggleFollowOrganization: toggleFollowMock,
    isFollowingOrganization: (slug: string) => slug === "kaaryab",
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
    ],
  }),
}));

describe("NetworkView", () => {
  it("renders the directory overview and follow controls", () => {
    render(<NetworkView />);

    expect(screen.getByText("page.title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "card.following" })).toBeInTheDocument();
    expect(screen.getByText("organizations.title")).toBeInTheDocument();
  });
});
