import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it } from "vitest";
import { Badge, EmptyState } from "@/components/ui";
import { vi } from "vitest";

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

describe("UI primitives", () => {
  it("renders a badge title and content", () => {
    render(
      <Badge tone="accent" title="Popular opportunity">
        Featured
      </Badge>
    );

    const badge = screen.getByText("Featured");
    expect(badge).toHaveAttribute("title", "Popular opportunity");
  });

  it("renders an empty state action link", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="There are no items yet."
        actionHref="/dashboard"
        actionLabel="Go back"
      />
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute("href", "/dashboard");
  });
});
