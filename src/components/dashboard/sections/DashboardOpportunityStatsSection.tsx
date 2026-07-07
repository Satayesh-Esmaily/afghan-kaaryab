import { Badge } from "@/components/ui";

export default function DashboardOpportunityStatsSection({
  stats,
}: {
  stats: {
    total: number;
    jobs: number;
    scholarships: number;
    internships: number;
  };
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">My Opportunities</h3>
        <Badge tone="info">Overview</Badge>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <OpportunityStatCard label="Total opportunities" value={stats.total} hint="All listings" tone="accent" />
        <OpportunityStatCard label="Jobs" value={stats.jobs} hint="Employment roles" tone="info" />
        <OpportunityStatCard label="Scholarships" value={stats.scholarships} hint="Education support" tone="warning" />
        <OpportunityStatCard label="Internships" value={stats.internships} hint="Career starters" tone="success" />
      </div>
    </div>
  );
}

function OpportunityStatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: number;
  hint: string;
  tone?: "default" | "info" | "success" | "accent" | "warning";
}) {
  const accents: Record<NonNullable<typeof tone>, string> = {
    default: "bg-[color:var(--border-strong)]",
    info: "bg-[color:var(--accent)]",
    success: "bg-[color:var(--success)]",
    accent: "bg-[color:var(--accent-strong)]",
    warning: "bg-[color:var(--warning)]",
  };

  return (
    <div className="rounded-[1.5rem] panel p-5">
      <div className={["h-1.5 w-14 rounded-full", accents[tone]].join(" ")} />
      <p className="mt-4 text-sm font-medium text-[color:var(--foreground-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">{hint}</p>
    </div>
  );
}
