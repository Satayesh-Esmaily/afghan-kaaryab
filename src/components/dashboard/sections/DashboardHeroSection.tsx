import Link from "next/link";
import { Badge } from "@/components/ui";
import { dashboardCopy } from "@/config/dashboard";

export default function DashboardHeroSection({
  stats,
  savedCount,
  userName,
}: {
  stats: {
    total: number;
    remote: number;
    expiringSoon: number;
  };
  savedCount: number;
  userName?: string;
}) {
  return (
    <div className="rounded-[1.5rem] accent-panel p-6 sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <Badge tone="accent">{dashboardCopy.heroBadge}</Badge>
          <div>
            {userName ? (
              <p className="text-sm font-medium text-white/80 sm:text-base">Welcome back, {userName}</p>
            ) : null}
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dashboardCopy.heroTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              {dashboardCopy.heroDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/add-opportunity"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
            >
              {dashboardCopy.heroPrimaryAction}
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {dashboardCopy.heroSecondaryAction}
            </Link>
          </div>
        </div>

        <div className="hidden rounded-[1.5rem] panel p-5 text-[color:var(--foreground)] lg:block">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              {dashboardCopy.snapshotLabel}
            </p>
            <Badge tone="success">{dashboardCopy.snapshotStatus}</Badge>
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
