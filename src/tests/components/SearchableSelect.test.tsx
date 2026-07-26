import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchableSelect from "@/components/common/SearchableSelect";
import type { SelectOption } from "@/data/profile-options";

describe("SearchableSelect", () => {
  it("filters options and emits the selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options: SelectOption[] = [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta" },
      { value: "gamma", label: "Gamma" },
      { value: "delta", label: "Delta" },
      { value: "epsilon", label: "Epsilon" },
      { value: "zeta", label: "Zeta" },
      { value: "eta", label: "Eta" },
      { value: "theta", label: "Theta" },
      { value: "iota", label: "Iota" },
    ];

    const { rerender } = render(
      <SearchableSelect value="" options={options} placeholder="Pick one" onChange={onChange} />
    );

    await user.click(screen.getByRole("button", { name: /Pick one/i }));
    await user.type(screen.getByPlaceholderText("Search..."), "gam");

    await user.click(screen.getByRole("button", { name: /Gamma/i }));

    expect(onChange).toHaveBeenCalledWith("gamma");

    rerender(<SearchableSelect value="gamma" options={options} placeholder="Pick one" onChange={onChange} />);

    expect(screen.getByRole("button", { name: /Gamma/i })).toBeInTheDocument();
  });
});
