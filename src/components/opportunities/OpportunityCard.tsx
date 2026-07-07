"use client";

import Link from "next/link";
import { useAppData } from "@/context/app-context";
import { Badge } from "@/components/ui";
import { formatDeadline, isExpiringSoon, type Opportunity } from "@/lib/opportunities";

function colorForCategory(category: Opportunity["category"]) {
  switch (category) {
    case "Job":
      return "info";
    case "Scholarship":
      return "accent";
    case "Internship":
      return "success";
    case "Online course":
      return "warning";
    default:
      return "default";
  }
}

export default function OpportunityCard({
  opportunity,
  compact = false,
}: {
  opportunity: Opportunity;
  compact?: boolean;
}) {
  const { isSaved, toggleSaved } = useAppData();
  const saved = isSaved(opportunity.id);

  return (
    <article className="group overflow-hidden rounded-[1.5rem] panel-strong transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden accent-panel p-5 sm:p-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-5 top-5 h-16 w-16 rounded-full border border-white/20" />
          <div className="absolute right-8 top-7 h-12 w-12 rounded-full border border-white/15" />
          <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full border border-dashed border-white/15" />
        </div>

        <div className="relative flex min-h-[210px] flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <Badge tone={colorForCategory(opportunity.category)}>{opportunity.category}</Badge>
            <button
              type="button"
              onClick={() => toggleSaved(opportunity.id)}
              className={[
                "inline-flex h-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold transition",
                saved
                  ? "border-white/20 bg-white text-[color:var(--accent)] shadow-lg"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/20",
              ].join(" ")}
              aria-label={saved ? "Remove from saved" : "Save opportunity"}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="space-y-2 text-white">
            <h3 className="text-[1.05rem] font-semibold leading-7 tracking-tight sm:text-[1.15rem]">
              {opportunity.title}
            </h3>
            <p className="text-sm font-medium text-white/80">{opportunity.organization}</p>
            <p className="max-w-[34ch] text-sm leading-6 text-white/85">
              {opportunity.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center text-white">
            <Metric label="Location" value={opportunity.location} />
            <Metric label="Type" value={opportunity.type} />
            <Metric label="Deadline" value={formatDeadline(opportunity.deadline)} />
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div
          className={[
            "h-1.5 w-16 rounded-full",
            colorForCategory(opportunity.category) === "info"
              ? "bg-[color:var(--accent)]"
              : colorForCategory(opportunity.category) === "success"
                ? "bg-[color:var(--success)]"
                : colorForCategory(opportunity.category) === "warning"
                  ? "bg-[color:var(--warning)]"
                  : "bg-[color:var(--border-strong)]",
          ].join(" ")}
        />

        <div className="flex flex-wrap items-center gap-2">
          {isExpiringSoon(opportunity.deadline) ? <Badge tone="warning">Expiring soon</Badge> : null}
          {opportunity.type === "Remote" ? <Badge tone="success">Remote</Badge> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-medium text-[color:var(--foreground-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-3 sm:grid-cols-2">
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="ds-button-primary inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition"
          >
            View details
          </Link>
          <a
            href={opportunity.applyLink}
            target="_blank"
            rel="noreferrer"
            className="ds-button-secondary inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition"
          >
            Apply now
          </a>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">{label}</p>
      <p className="mt-1 truncate text-[11px] font-medium leading-5 text-white">{value}</p>
    </div>
  );
}
