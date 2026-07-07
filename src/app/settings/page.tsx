import type { Metadata } from "next";
import { Badge, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Settings",
  description: "Adjust your preferences for KaarYab Afghanistan.",
};

const preferenceRows = [
  {
    title: "Email notifications",
    description: "Receive occasional updates about saved opportunities and new listings.",
    checked: true,
  },
  {
    title: "Weekly summary",
    description: "Get a short recap of new items and deadline changes every week.",
    checked: false,
  },
  {
    title: "Public profile",
    description: "Allow your profile to be discoverable inside the demo platform.",
    checked: false,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Settings"
        title="Tune your experience"
        description="Manage the small details that make the platform feel more personal, clear, and ready for demo use."
      />

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="ds-card rounded-[1.5rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge tone="accent">Preferences</Badge>
              <h2 className="ds-title mt-4 text-2xl font-semibold">Appearance and notifications</h2>
              <p className="ds-muted mt-2 max-w-2xl text-sm leading-7">
                Keep the interface clean, control updates, and make the demo easier to present.
              </p>
            </div>
            <div className="hidden rounded-[1.25rem] bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-soft))] px-4 py-3 text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-muted)]">
                Current mode
              </p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--foreground-strong)]">Balanced</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {preferenceRows.map((item, index) => (
              <div
                key={item.title}
                className={[
                  "flex items-center justify-between gap-4 rounded-[1.25rem] border px-4 py-4",
                  index === 0
                    ? "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)]/35"
                    : "border-[color:var(--border)] bg-[color:var(--surface-soft)]",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[color:var(--foreground)]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--foreground-muted)]">{item.description}</p>
                </div>
                <label className="inline-flex shrink-0 items-center">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="h-5 w-5 rounded border-[color:var(--border-strong)] accent-[color:var(--accent)]"
                    aria-label={item.title}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="success">Display</Badge>
            <h2 className="ds-title mt-4 text-xl font-semibold">Visual style</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Theme", "Dark / Light toggle in the header"],
                ["Density", "Comfortable spacing"],
                ["Motion", "Soft transitions only"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-[color:var(--surface-soft)] px-4 py-3">
                  <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
                  <span className="text-sm text-[color:var(--foreground-muted)]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="warning">Data</Badge>
            <h2 className="ds-title mt-4 text-xl font-semibold">Local demo controls</h2>
            <p className="ds-muted mt-2 text-sm leading-7">
              These actions are safe for the demo version and keep the experience simple.
            </p>
            <div className="mt-5 space-y-3">
              <button type="button" className="ds-button-secondary w-full rounded-2xl px-4 py-3 text-sm font-semibold transition">
                Export local data
              </button>
              <button type="button" className="ds-button-primary w-full rounded-2xl px-4 py-3 text-sm font-semibold transition">
                Save settings
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
