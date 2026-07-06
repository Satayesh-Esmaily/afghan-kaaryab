import Link from "next/link";
import type { Metadata } from "next";
import { demoOpportunities } from "@/data/opportunities";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { Badge } from "@/components/ui";
import { isExpiringSoon } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "KaarYab Afghanistan",
  description:
    "A modern opportunity finder platform for Afghan youth to discover jobs, internships, scholarships, remote work, and skill-building opportunities.",
};

export default function HomePage() {
  const featured = demoOpportunities.filter((item) => item.featured).slice(0, 3);
  const expiringSoon = demoOpportunities.filter((item) => isExpiringSoon(item.deadline)).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="rounded-[2rem] accent-panel p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <Badge tone="default">Demo Data</Badge>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Discover opportunities for Afghan youth in one clean place.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Browse jobs, internships, scholarships, remote work, and training programs with
                search, filters, saved items, and a polished presentation-ready interface.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/opportunities"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
                >
                  Explore opportunities
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Open dashboard
                </Link>
              </div>
            </div>

            <div className="hidden rounded-[2rem] border border-white/15 bg-white/10 p-5 lg:block">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">What is included</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Search and filter opportunities",
                  "Save opportunities for later",
                  "Add, edit, and delete listings",
                  "Dark mode and responsive design",
                ].map((item) => (
                  <div key={item} className="rounded-[1.25rem] bg-white/10 px-4 py-3 text-sm text-white/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[2rem] panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Quick stats
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <QuickStat label="Listings" value={demoOpportunities.length} />
              <QuickStat label="Featured" value={featured.length} />
              <QuickStat label="Soon" value={expiringSoon} />
              <QuickStat label="Categories" value="7" />
            </div>
          </div>

          <div className="rounded-[2rem] panel-soft p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">
              Target users
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Students", "Job seekers", "Fresh graduates", "Women", "Organizations"].map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Job", "Open roles and hiring opportunities."],
          ["Internship", "Entry-level learning opportunities."],
          ["Scholarship", "Study support and funding options."],
          ["Remote work", "Flexible work and online roles."],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-[2rem] panel p-5"
          >
            <p className="text-lg font-semibold text-slate-950 dark:text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Highlighted opportunities
            </h2>
          </div>
          <Link href="/opportunities" className="text-sm font-medium text-slate-500 dark:text-slate-400">
            See all
          </Link>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {featured.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} compact />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] panel p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] section-kicker">
              Ready for demo
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              A polished final project with real product feel.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              This build includes responsive layouts, dark mode, localStorage persistence, dynamic
              routes, CRUD actions, and a dashboard that makes the project easier to present.
            </p>
          </div>
          <Link
            href="/add-opportunity"
            className="inline-flex items-center justify-center rounded-2xl accent-button px-5 py-3 text-sm font-semibold transition"
          >
            Submit an opportunity
          </Link>
        </div>
      </section>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[1.5rem] panel-soft px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
