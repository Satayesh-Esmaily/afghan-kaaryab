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
    <article className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-400 opacity-80" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone={colorForCategory(opportunity.category)}>{opportunity.category}</Badge>
            {isExpiringSoon(opportunity.deadline) ? <Badge tone="warning">Expiring soon</Badge> : null}
            {opportunity.type === "Remote" ? <Badge tone="success">Remote</Badge> : null}
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {opportunity.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {opportunity.organization}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleSaved(opportunity.id)}
          className={[
            "inline-flex h-11 min-w-20 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition",
            saved
              ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
          ].join(" ")}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Location
          </p>
          <p className="mt-1 font-medium">{opportunity.location}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Type
          </p>
          <p className="mt-1 font-medium">{opportunity.type}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Deadline
          </p>
          <p className="mt-1 font-medium">{formatDeadline(opportunity.deadline)}</p>
        </div>
      </div>

      <p
        className={`mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300 ${
          compact ? "line-clamp-2" : "line-clamp-3"
        }`}
      >
        {opportunity.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {opportunity.tags.slice(0, compact ? 2 : 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          View details
        </Link>
        <a
          href={opportunity.applyLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Apply now
        </a>
      </div>
    </article>
  );
}
