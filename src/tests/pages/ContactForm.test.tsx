import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/components/contact/ContactForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("submits the contact request and shows a success message", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, message: "messageSent" }),
      })
    );

    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("placeholders.name"), "Amina");
    await user.type(screen.getByPlaceholderText("placeholders.email"), "amina@example.com");
    await user.type(screen.getByPlaceholderText("placeholders.subject"), "Hello");
    await user.type(screen.getByPlaceholderText("placeholders.message"), "Need support.");
    await user.click(screen.getByRole("button", { name: "submitLabel" }));

    expect(fetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
    expect(await screen.findByText("messageSent")).toBeInTheDocument();
  });
});
