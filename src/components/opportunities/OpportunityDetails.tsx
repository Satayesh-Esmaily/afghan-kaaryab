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
      <section className="ds-card rounded-[1.5rem] p-6 sm:p-8">
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
            <p className="ds-muted text-base leading-7">
              {opportunity.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toggleSaved(opportunity.id)}
              className="ds-button-secondary rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              {saved ? "Remove saved" : "Save opportunity"}
            </button>
            <Link
              href={`/opportunities/${opportunity.id}/edit`}
              className="ds-button-primary rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full border border-transparent bg-[color:var(--danger-soft)] px-5 py-3 text-sm font-semibold text-[color:var(--danger)] transition hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="ds-card rounded-[1.5rem] p-6">
          <h2 className="ds-title text-xl font-semibold">Requirements</h2>
          <ul className="mt-4 space-y-3">
            {opportunity.requirements.map((requirement) => (
              <li
                key={requirement}
                className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)]"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--success-soft)] text-xs font-bold text-[color:var(--success)]">
                  OK
                </span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="ds-card rounded-[1.5rem] p-6">
            <h2 className="ds-title text-xl font-semibold">Opportunity Details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <DetailRow label="Organization" value={opportunity.organization} />
              <DetailRow label="Location" value={opportunity.location} />
              <DetailRow label="Type" value={opportunity.type} />
              <DetailRow label="Deadline" value={formatDeadline(opportunity.deadline)} />
              <DetailRow label="Apply link" value={opportunity.applyLink} link />
            </dl>
          </div>

          <div className="ds-card rounded-[1.5rem] p-6">
            <h2 className="ds-title text-xl font-semibold">Tags</h2>
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
                className="ds-button-primary inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
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
    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-3 last:border-b-0 last:pb-0">
      <dt className="font-medium text-[color:var(--foreground-muted)]">{label}</dt>
      <dd className="max-w-[65%] text-right font-semibold text-[color:var(--foreground-strong)]">
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="break-all text-[color:var(--accent-strong)] underline-offset-4 hover:underline"
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
