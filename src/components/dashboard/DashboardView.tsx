"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import { daysUntilDeadline, getDashboardStats, isExpiringSoon } from "@/lib/opportunities";

export default function DashboardView() {
  const { opportunities } = useAppData();
  const stats = getDashboardStats(opportunities);
  const maxCategory = Math.max(...stats.categories.map((item) => item.value), 1);
  const calendar = buildCalendar();

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="rounded-[2rem] accent-panel p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <Badge tone="default">Welcome Back</Badge>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Unlock opportunity access
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
                  Track opportunities, monitor upcoming deadlines, and keep your platform data
                  organized for the final presentation.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/add-opportunity"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
                >
                  Add opportunity
                </Link>
                <Link
                  href="/opportunities"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Discover listings
                </Link>
              </div>
            </div>

            <div className="hidden rounded-[2rem] panel p-5 text-[color:var(--foreground)] lg:block">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Snapshot</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <SnapshotItem label="Total" value={stats.total} />
                <SnapshotItem label="Remote" value={stats.remote} />
                <SnapshotItem label="Soon" value={stats.expiringSoon} />
                <SnapshotItem label="Saved" value={opportunities.length - stats.recent.length} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <button className="text-2xl text-[color:var(--muted)]" aria-label="Previous month">
              {"<"}
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-[color:var(--foreground)]">July 2026</p>
              <p className="text-sm text-[color:var(--muted)]">Deadline calendar</p>
            </div>
            <button className="text-2xl text-[color:var(--muted)]" aria-label="Next month">
              {">"}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-medium text-[color:var(--muted)]">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendar.map((day, index) => (
              <CalendarCell key={`${day}-${index}`} day={day} active={day === 6} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[color:var(--foreground)]">My Opportunities</h3>
            <Link href="/opportunities" className="text-sm font-medium text-[color:var(--muted)]">
              See all
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <OpportunityStatCard label="Total opportunities" value={stats.total} hint="All listings" />
            <OpportunityStatCard label="Jobs" value={stats.jobs} hint="Employment roles" />
            <OpportunityStatCard label="Scholarships" value={stats.scholarships} hint="Education support" />
            <OpportunityStatCard label="Internships" value={stats.internships} hint="Career starters" />
          </div>

          <div className="rounded-[2rem] panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Category Breakdown</h3>
              <span className="text-sm text-[color:var(--muted)]">Live overview</span>
            </div>
            <div className="mt-5 space-y-4">
              {stats.categories.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[color:var(--foreground)]">{item.label}</span>
                    <span className="text-[color:var(--muted)]">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-strong),#4cc9f0)]"
                      style={{ width: `${Math.max((item.value / maxCategory) * 100, 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Today&apos;s Tasks</h3>
              <Link href="/saved" className="text-sm font-medium text-[color:var(--muted)]">
                See all
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Review expiring opportunities",
                "Edit or delete one outdated listing",
                "Prepare a demo talk track",
              ].map((task, index) => (
                <div
                  key={task}
                  className="flex items-center justify-between rounded-[1.5rem] panel-soft px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">{task}</p>
                      <p className="text-sm text-[color:var(--muted)]">Final project presentation</p>
                    </div>
                  </div>
                  <Badge tone="info">Done</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Recent submissions</h3>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-full accent-button">
                +
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {stats.recent.map((opportunity, index) => (
                <div
                  key={opportunity.id}
                  className={[
                    "rounded-[1.5rem] border p-4",
                    index === 0
                      ? "border-[color:var(--accent-soft)] panel-soft"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[color:var(--foreground)]">{opportunity.title}</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{opportunity.organization}</p>
                    </div>
                    <Badge tone={isExpiringSoon(opportunity.deadline) ? "warning" : "default"}>
                      {daysUntilDeadline(opportunity.deadline) < 0
                        ? "Expired"
                        : `${daysUntilDeadline(opportunity.deadline)}d`}
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm text-[color:var(--muted)]">
                    {opportunity.category} - {opportunity.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] accent-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Quick insight
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Always keep the dashboard updated.</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">
              Show the teacher that you can create useful product analytics from simple local data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SnapshotItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.25rem] bg-white/10 p-4 text-left">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/65">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function OpportunityStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-[2rem] panel p-5">
      <p className="text-sm font-medium text-[color:var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[color:var(--muted)]">{hint}</p>
    </div>
  );
}

function CalendarCell({ day, active }: { day: number | null; active?: boolean }) {
  if (day === null) {
    return <div className="h-10" />;
  }

  return (
    <div className={["flex h-10 items-center justify-center rounded-full text-sm", active ? "active-pill font-semibold" : "text-[color:var(--muted)]"].join(" ")}>
      {day}
    </div>
  );
}

function buildCalendar() {
  return [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
}
