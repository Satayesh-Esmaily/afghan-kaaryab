import Link from "next/link";
import { Badge } from "@/components/ui";

export default function DashboardHeroSection({
  stats,
  savedCount,
}: {
  stats: {
    total: number;
    remote: number;
    expiringSoon: number;
  };
  savedCount: number;
}) {
  return (
    <div className="rounded-[1.5rem] accent-panel p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <Badge tone="accent">Welcome Back</Badge>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Unlock opportunity access
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Track opportunities, monitor upcoming deadlines, and keep your platform data
              organized for the final presentation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/add-opportunity"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
            >
              Add opportunity
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Discover listings
            </Link>
          </div>
        </div>

        <div className="hidden rounded-[1.5rem] panel p-5 text-[color:var(--foreground)] lg:block">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              Snapshot
            </p>
            <Badge tone="success">Live</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SnapshotItem label="Total" value={stats.total} tone="accent" />
            <SnapshotItem label="Remote" value={stats.remote} tone="success" />
            <SnapshotItem label="Soon" value={stats.expiringSoon} tone="warning" />
            <SnapshotItem label="Saved" value={savedCount} tone="default" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SnapshotItem({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "info" | "success" | "accent" | "warning";
}) {
  const labelColors: Record<NonNullable<typeof tone>, string> = {
    default: "text-[color:var(--foreground-muted)]",
    info: "text-[color:var(--accent)]",
    success: "text-[color:var(--success)]",
    accent: "text-[color:var(--accent-strong)]",
    warning: "text-[color:var(--warning)]",
  };

  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4 text-left">
      <p className={["text-[10px] font-semibold uppercase tracking-[0.22em]", labelColors[tone]].join(" ")}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
        {value}
      </p>
    </div>
  );
}
