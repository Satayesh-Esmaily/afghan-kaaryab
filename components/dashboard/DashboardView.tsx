"use client";

import { SectionHeading, StatCard, Badge } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import {
  daysUntilDeadline,
  getDashboardStats,
  isExpiringSoon,
} from "@/lib/opportunities";

export default function DashboardView() {
  const { opportunities } = useAppData();
  const stats = getDashboardStats(opportunities);

  const maxCategory = Math.max(...stats.categories.map((item) => item.value), 1);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Track the platform in one glance"
        description="Use this dashboard to understand the size of the listing pool, what types of opportunities are available, and what needs attention soon."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total opportunities" value={stats.total} tone="info" hint="All published items" />
        <StatCard label="Jobs" value={stats.jobs} tone="default" hint="Employment listings" />
        <StatCard label="Scholarships" value={stats.scholarships} tone="accent" hint="Education opportunities" />
        <StatCard label="Internships" value={stats.internships} tone="success" hint="Entry-level experience" />
        <StatCard label="Remote opportunities" value={stats.remote} tone="info" hint="Remote or online work" />
        <StatCard label="Expiring soon" value={stats.expiringSoon} tone="accent" hint="Deadline within 14 days" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Category breakdown</h2>
          <div className="mt-6 space-y-4">
            {stats.categories.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#0ea5e9,#a855f7)]"
                    style={{ width: `${Math.max((item.value / maxCategory) * 100, 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Recent submissions</h2>
          <div className="mt-5 space-y-4">
            {stats.recent.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{opportunity.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{opportunity.organization}</p>
                  </div>
                  <Badge tone={isExpiringSoon(opportunity.deadline) ? "warning" : "default"}>
                    {daysUntilDeadline(opportunity.deadline) < 0
                      ? "Expired"
                      : `${daysUntilDeadline(opportunity.deadline)} days`}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {opportunity.category} - {opportunity.location}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
