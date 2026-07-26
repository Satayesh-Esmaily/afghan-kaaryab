import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddOpportunityView from "@/components/opportunities/AddOpportunityView";

const pushMock = vi.fn();
const addOpportunityMock = vi.fn(() => ({ id: "created-1" }));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/context/opportunities-context", () => ({
  useOpportunitiesContext: () => ({
    addOpportunity: addOpportunityMock,
  }),
}));

vi.mock("@/components/opportunities/OpportunityForm", () => ({
  default: ({ submitLabel, onSubmit }: { submitLabel: string; onSubmit: (values: { title: string }) => void }) => (
    <button type="button" onClick={() => onSubmit({ title: "Sample opportunity" })}>
      {submitLabel}
    </button>
  ),
}));

describe("AddOpportunityView", () => {
  it("creates an opportunity and navigates to its detail page", async () => {
    const user = userEvent.setup();

    render(<AddOpportunityView />);

    await user.click(screen.getByRole("button", { name: "page.submitLabel" }));

    expect(addOpportunityMock).toHaveBeenCalledWith({ title: "Sample opportunity" });
    expect(pushMock).toHaveBeenCalledWith("/opportunities/created-1");
  });
});
