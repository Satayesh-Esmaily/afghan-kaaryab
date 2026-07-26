import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import type { Opportunity } from "@/lib/opportunities";

const { pushMock, toggleSavedMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  toggleSavedMock: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    isSaved: () => false,
    toggleSaved: toggleSavedMock,
  }),
}));

describe("OpportunityCard", () => {
  it("navigates to the detail page and toggles saved state", async () => {
    const user = userEvent.setup();
    const opportunity: Opportunity = {
      id: "opp-1",
      title: "Frontend Developer",
      organization: "KaarYab",
      category: "Job",
      location: "Kabul",
      type: "Remote",
      deadline: "2026-08-15",
      description: "Build and maintain the front-end experience.",
      requirements: ["React"],
      applyLink: "https://example.com/apply",
      tags: ["React", "TypeScript"],
    };

    render(<OpportunityCard opportunity={opportunity} />);

    await user.click(screen.getByRole("heading", { name: "Frontend Developer" }));
    expect(pushMock).toHaveBeenCalledWith("/en/opportunities/opp-1");

    await user.click(screen.getByRole("button", { name: "save" }));
    expect(toggleSavedMock).toHaveBeenCalledWith("opp-1");

    expect(screen.getAllByRole("link", { name: "viewDetails" })[1]).toHaveAttribute(
      "href",
      "/en/opportunities/opp-1"
    );
  });
});
