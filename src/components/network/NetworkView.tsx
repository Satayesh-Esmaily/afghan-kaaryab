"use client";

import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import { networkPageCopy } from "@/config/network";
import { demoOpportunities } from "@/data/opportunities";
import {
  getCountryEntries,
  getInstitutionEntries,
  getOrganizationEntries,
} from "@/lib/network";

export default function NetworkView() {
  const {
    followedOrganizationSlugs,
    toggleFollowOrganization,
    isFollowingOrganization,
    opportunities,
    hydrated,
  } = useAppData();
  const activeOpportunities = hydrated ? opportunities : demoOpportunities;
  const organizations = getOrganizationEntries(activeOpportunities);
  const countries = getCountryEntries(activeOpportunities);
  const institutions = getInstitutionEntries(activeOpportunities);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={networkPageCopy.eyebrow}
        title={networkPageCopy.title}
        description={networkPageCopy.description}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <NetworkStatCard label="Organizations" value={organizations.length} tone="accent" />
        <NetworkStatCard label="Countries" value={countries.length} tone="success" />
        <NetworkStatCard label="Institutions" value={institutions.length} tone="warning" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="ds-title text-2xl font-semibold">{networkPageCopy.organizationsTitle}</h2>
              <p className="ds-muted mt-2 text-sm leading-7">
                Organizations currently active on the platform and connected to available listings.
              </p>
            </div>
            <Badge tone="info">{networkPageCopy.organizationsBadge}</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {organizations.map((entry) => (
              <DirectoryCard
                key={entry.slug}
                href={`/organizations/${entry.slug}`}
                title={entry.name}
                count={entry.count}
                body={entry.categories.join(" • ")}
                meta={entry.locations.join(", ")}
                accent="accent"
                followed={isFollowingOrganization(entry.slug)}
                onFollow={() => toggleFollowOrganization(entry.slug)}
              />
            ))}
          </div>

          <div className="mt-5 text-sm text-[color:var(--foreground-muted)]">
            Following {followedOrganizationSlugs.length} organizations
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="ds-title text-2xl font-semibold">{networkPageCopy.countriesTitle}</h2>
                <p className="ds-muted mt-2 text-sm leading-7">
                  Afghan opportunities first, with remote roles and regional reach where available.
                </p>
              </div>
              <Badge tone="success">{networkPageCopy.countriesBadge}</Badge>
            </div>

            <div className="mt-5 space-y-4">
              {countries.map((entry) => (
                <DirectoryListRow
                  key={entry.name}
                  title={entry.name}
                  count={entry.count}
                  body={entry.locations.join(", ")}
                  tone={entry.name === "Global Remote" ? "success" : "accent"}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="ds-title text-2xl font-semibold">{networkPageCopy.institutionsTitle}</h2>
                <p className="ds-muted mt-2 text-sm leading-7">
                  Grouped by the type of institution behind each listing.
                </p>
              </div>
              <Badge tone="warning">{networkPageCopy.institutionsBadge}</Badge>
            </div>

            <div className="mt-5 space-y-4">
              {institutions.map((entry) => (
                <DirectoryListRow
                  key={entry.name}
                  title={entry.name}
                  count={entry.count}
                  body={entry.examples.join(", ")}
                  tone="warning"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NetworkStatCard({
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

function DirectoryCard({
  href,
  title,
  count,
  body,
  meta,
  accent,
  followed,
  onFollow,
}: {
  href: string;
  title: string;
  count: number;
  body: string;
  meta: string;
  accent: "accent" | "success" | "warning";
  followed: boolean;
  onFollow: () => void;
}) {
  const color =
    accent === "success"
      ? "bg-[color:var(--success)]"
      : accent === "warning"
        ? "bg-[color:var(--warning)]"
        : "bg-[color:var(--accent)]";

  return (
    <article className="relative rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={href} className="absolute inset-0 z-0 rounded-[1.35rem]" aria-label={`Open ${title}`} />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={["h-2.5 w-2.5 rounded-full", color].join(" ")} />
            <h3 className="truncate text-base font-semibold text-[color:var(--foreground)]">{title}</h3>
          </div>
          <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">{body}</p>
          <p className="mt-2 text-xs text-[color:var(--foreground-muted)]">{meta}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone="default">{count}</Badge>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFollow();
            }}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              followed
                ? "bg-[color:var(--accent)] text-white"
                : "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]",
            ].join(" ")}
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </article>
  );
}

function DirectoryListRow({
  title,
  count,
  body,
  tone,
}: {
  title: string;
  count: number;
  body: string;
  tone: "accent" | "success" | "warning";
}) {
  const badge =
    tone === "success"
      ? "bg-[color:var(--success-soft)] text-[color:var(--success)]"
      : tone === "warning"
        ? "bg-[color:var(--warning-soft)] text-[color:var(--warning)]"
        : "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]";

  return (
    <div className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-[color:var(--foreground)]">{title}</p>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{body}</p>
      </div>
      <span className={["rounded-full px-3 py-1 text-xs font-semibold", badge].join(" ")}>{count}</span>
    </div>
  );
}
