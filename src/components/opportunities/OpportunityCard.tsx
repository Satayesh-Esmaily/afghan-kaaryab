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
    <article className="group overflow-hidden rounded-[2rem] panel-strong transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[16/9] overflow-hidden accent-panel p-5">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-4 top-4 h-20 w-20 rounded-full border border-white/25" />
          <div className="absolute right-12 top-8 h-14 w-14 rounded-full border border-white/20" />
          <div className="absolute bottom-6 left-8 h-3 w-3 rounded-full bg-white/60" />
          <div className="absolute bottom-12 right-8 h-5 w-5 rounded-full border border-white/35" />
          <div className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full border border-dashed border-white/20" />
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <Badge tone={colorForCategory(opportunity.category)}>{opportunity.category}</Badge>
            <button
              type="button"
              onClick={() => toggleSaved(opportunity.id)}
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition",
                saved
                  ? "border-white/20 bg-white text-[color:var(--accent)] shadow-lg"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/20",
              ].join(" ")}
              aria-label={saved ? "Remove from saved" : "Save opportunity"}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-white">
            <Metric label="Location" value={opportunity.location} />
            <Metric label="Type" value={opportunity.type} />
            <Metric label="Deadline" value={formatDeadline(opportunity.deadline)} />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isExpiringSoon(opportunity.deadline) ? <Badge tone="warning">Expiring soon</Badge> : null}
            {opportunity.type === "Remote" ? <Badge tone="success">Remote</Badge> : null}
          </div>
          <h3 className="text-[1.05rem] font-semibold leading-7 tracking-tight text-[color:var(--foreground)]">
            {opportunity.title}
          </h3>
          <p className="text-sm font-medium text-[color:var(--muted)]">{opportunity.organization}</p>
        </div>

        <p
          className={`text-sm leading-6 text-[color:var(--muted)] ${
            compact ? "line-clamp-2" : "line-clamp-3"
          }`}
        >
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl accent-button px-4 py-3 text-sm font-semibold transition"
          >
            View details
          </Link>
          <a
            href={opportunity.applyLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl panel px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-slate-100 dark:hover:bg-white/10"
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
    <div className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">{label}</p>
      <p className="mt-1 text-xs font-medium leading-5 text-white">{value}</p>
    </div>
  );
}
