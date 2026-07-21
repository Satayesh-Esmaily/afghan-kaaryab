"use client";

import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { formatDeadline, type Opportunity } from "@/lib/opportunities";
import type { OrganizationProfile } from "@/lib/network";

export default function OrganizationDetailsView({
  organization,
}: {
  organization: OrganizationProfile;
}) {
  const { isFollowingOrganization, toggleFollowOrganization } = useOpportunitiesContext();
  const followed = isFollowingOrganization(organization.slug);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Organization"
        title={organization.name}
        description="Review the organization profile, see its current opportunities, and follow it for later updates."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Listings" value={organization.count} tone="accent" />
        <SummaryCard label="Locations" value={organization.locations.length} tone="success" />
        <SummaryCard label="Featured" value={organization.featuredCount} tone="warning" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.5rem] panel p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="info">Organization profile</Badge>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
                {organization.categories.join(" / ")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => toggleFollowOrganization(organization.slug)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                followed
                  ? "bg-[color:var(--accent)] text-white"
                  : "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]",
              ].join(" ")}
            >
              {followed ? "Following" : "Follow"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoChip label="Primary locations" value={organization.locations.join(", ")} />
            <InfoChip label="Organization slug" value={organization.slug} />
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
              <p className="text-sm font-semibold text-[color:var(--foreground)]">About this organization</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">
                This profile helps job seekers learn more about the organization before applying.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
              <p className="text-sm font-semibold text-[color:var(--foreground)]">Related opportunities</p>
              <div className="mt-4 space-y-3">
                {organization.opportunities.map((opportunity) => (
                  <OpportunityRow key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              Current footprint
            </p>
            <div className="mt-5 space-y-4">
              {organization.locations.map((location) => (
                <div
                  key={location}
                  className="flex items-center justify-between rounded-[1.25rem] bg-[color:var(--surface-soft)] px-4 py-4"
                >
                  <span className="font-medium text-[color:var(--foreground)]">{location}</span>
                  <Badge tone="default">Active</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] accent-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Quick action
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Keep this organization on your radar.</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">
              Following the organization keeps it easy to revisit when new opportunities are posted.
            </p>
            <Link
              href="/organizations"
              className="mt-5 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
            >
              Back to directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent" | "success" | "warning";
}) {
  const bar =
    tone === "success"
      ? "bg-[color:var(--success)]"
      : tone === "warning"
        ? "bg-[color:var(--warning)]"
        : "bg-[color:var(--accent)]";

  return (
    <div className="rounded-[1.5rem] panel p-5">
      <div className={["h-1.5 w-14 rounded-full", bar].join(" ")} />
      <p className="mt-4 text-sm font-medium text-[color:var(--foreground-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
        {value}
      </p>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function OpportunityRow({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-[color:var(--foreground)]">{opportunity.title}</p>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
            {opportunity.category} • {opportunity.type}
          </p>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
            Deadline {formatDeadline(opportunity.deadline)}
          </p>
        </div>
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--accent-strong)]"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
