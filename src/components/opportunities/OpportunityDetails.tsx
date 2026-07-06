"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppData } from "@/context/app-context";
import { Badge, ConfirmDialog, EmptyState, SectionHeading } from "@/components/ui";
import { formatDeadline, getOpportunityById, isExpiringSoon } from "@/lib/opportunities";

export default function OpportunityDetails() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { opportunities, isSaved, toggleSaved, deleteOpportunity } = useAppData();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const opportunity = id ? getOpportunityById(opportunities, id) : undefined;

  if (!opportunity) {
    return (
      <EmptyState
        title="Opportunity not found"
        description="This opportunity may have been deleted or the link may be outdated."
        actionHref="/opportunities"
        actionLabel="Back to opportunities"
      />
    );
  }

  const saved = isSaved(opportunity.id);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{opportunity.category}</Badge>
          <Badge tone={isExpiringSoon(opportunity.deadline) ? "warning" : "default"}>
            {isExpiringSoon(opportunity.deadline) ? "Expiring soon" : "Open opportunity"}
          </Badge>
          <Badge tone={opportunity.type === "Remote" ? "success" : "default"}>{opportunity.type}</Badge>
        </div>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <SectionHeading title={opportunity.title} description={opportunity.organization} />
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              {opportunity.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toggleSaved(opportunity.id)}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              {saved ? "Remove saved" : "Save opportunity"}
            </button>
            <Link
              href={`/opportunities/${opportunity.id}/edit`}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Requirements</h2>
          <ul className="mt-4 space-y-3">
            {opportunity.requirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                  OK
                </span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Opportunity Details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <DetailRow label="Organization" value={opportunity.organization} />
              <DetailRow label="Location" value={opportunity.location} />
              <DetailRow label="Type" value={opportunity.type} />
              <DetailRow label="Deadline" value={formatDeadline(opportunity.deadline)} />
              <DetailRow label="Apply link" value={opportunity.applyLink} link />
            </dl>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a
                href={opportunity.applyLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Open apply page
              </a>
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this opportunity?"
        description="This will permanently remove the opportunity from the list and from any saved items."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteOpportunity(opportunity.id);
          setDeleteOpen(false);
          router.push("/opportunities");
        }}
      />
    </div>
  );
}

function DetailRow({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-white/10">
      <dt className="font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="max-w-[65%] text-right font-semibold text-slate-950 dark:text-white">
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="break-all text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-300"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
