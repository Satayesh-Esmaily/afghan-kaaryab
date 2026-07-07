import { Badge } from "@/components/ui";

export default function DashboardCategoryBreakdownSection({
  categories,
}: {
  categories: Array<{ label: string; value: number }>;
}) {
  const total = Math.max(...categories.map((item) => item.value), 1);

  return (
    <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] p-6 shadow-sm dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Category Breakdown</h3>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">Live overview</p>
        </div>
        <Badge tone="info">{categories.length} categories</Badge>
      </div>
      <div className="mt-6 space-y-4">
        {categories.map((item) => (
          <CategoryBreakdownRow key={item.label} label={item.label} value={item.value} total={total} />
        ))}
      </div>
    </div>
  );
}

function CategoryBreakdownRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = Math.max((value / total) * 100, 10);
  const tone = getCategoryTone(label);

  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 shadow-sm transition dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={["h-2.5 w-2.5 shrink-0 rounded-full", tone.dot].join(" ")} />
          <span className="truncate text-sm font-semibold text-[color:var(--foreground)]">{label}</span>
        </div>
        <span className={["rounded-full px-2.5 py-0.5 text-xs font-semibold", tone.badge].join(" ")}>
          {value}
        </span>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[color:var(--surface-soft)] dark:bg-white/5">
        <div className={["h-full rounded-full transition-all", tone.bar].join(" ")} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function getCategoryTone(label: string) {
  switch (label) {
    case "Job":
      return {
        dot: "bg-[#ff5a1f]",
        badge: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
        bar: "bg-[linear-gradient(90deg,#ff5a1f,#ff8a5a,var(--warning))]",
      };
    case "Internship":
      return {
        dot: "bg-[color:var(--accent)]",
        badge: "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]",
        bar: "bg-[linear-gradient(90deg,var(--accent),#6f8cff,#67b7ff)]",
      };
    case "Scholarship":
      return {
        dot: "bg-[color:var(--success)]",
        badge: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
        bar: "bg-[linear-gradient(90deg,var(--success),#4ecb7c,#8adf9d)]",
      };
    case "Online course":
      return {
        dot: "bg-[color:var(--warning)]",
        badge: "bg-[color:var(--warning-soft)] text-[color:var(--warning)]",
        bar: "bg-[linear-gradient(90deg,var(--warning),#ffd766,#7ad7c1)]",
      };
    case "Remote work":
      return {
        dot: "bg-[color:var(--accent-strong)]",
        badge: "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
        bar: "bg-[linear-gradient(90deg,var(--accent-strong),#7c6bff,#67b7ff)]",
      };
    case "Training program":
      return {
        dot: "bg-[color:var(--success)]",
        badge: "bg-[color:var(--success-soft)] text-[color:var(--success)]",
        bar: "bg-[linear-gradient(90deg,#3bcf72,#67b7ff,var(--accent))]",
      };
    case "Volunteer work":
      return {
        dot: "bg-[#ff5a1f]",
        badge: "bg-[color:var(--danger-soft)] text-[color:var(--danger)]",
        bar: "bg-[linear-gradient(90deg,#ff5a1f,#7c6bff,#67b7ff)]",
      };
    default:
      return {
        dot: "bg-[color:var(--border-strong)]",
        badge: "bg-[color:var(--surface-soft)] text-[color:var(--foreground-muted)]",
        bar: "bg-[linear-gradient(90deg,var(--accent),#7c6bff,#67b7ff,var(--success))]",
      };
  }
}
