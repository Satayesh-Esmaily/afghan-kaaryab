import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DatePickerField from "@/components/common/DatePickerField";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

describe("DatePickerField", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens the calendar, emits the selected date, and renders the formatted value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <DatePickerField value="2026-07-01" onChange={onChange} placeholder="Pick date" />
    );

    await user.click(screen.getByRole("button", { name: /Jul 1, 2026/i }));
    await user.click(screen.getByRole("button", { name: "15" }));

    expect(onChange).toHaveBeenCalledWith("2026-07-15");

    rerender(<DatePickerField value="2026-07-15" onChange={onChange} placeholder="Pick date" />);

    expect(screen.getByRole("button", { name: /Jul 15, 2026/i })).toBeInTheDocument();
  });
});
