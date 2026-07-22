import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard.opportunities");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{t("title")}</h3>
        <Badge tone="info">{t("badge")}</Badge>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <OpportunityStatCard label={t("items.total.label")} value={stats.total} hint={t("items.total.hint")} tone="accent" />
        <OpportunityStatCard label={t("items.jobs.label")} value={stats.jobs} hint={t("items.jobs.hint")} tone="info" />
        <OpportunityStatCard
          label={t("items.scholarships.label")}
          value={stats.scholarships}
          hint={t("items.scholarships.hint")}
          tone="warning"
        />
        <OpportunityStatCard
          label={t("items.internships.label")}
          value={stats.internships}
          hint={t("items.internships.hint")}
          tone="success"
        />
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
