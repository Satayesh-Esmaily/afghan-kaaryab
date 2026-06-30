import Link from "next/link";
import type { Metadata } from "next";
import { demoOpportunities } from "@/data/opportunities";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { Badge, SectionHeading, StatCard } from "@/components/ui";
import { isExpiringSoon } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "KaarYab Afghanistan",
  description:
    "An opportunity finder platform for Afghan youth to discover jobs, internships, scholarships, remote work, and skill-building opportunities.",
};

export default function HomePage() {
  const featured = demoOpportunities.filter((item) => item.featured).slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_40%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(241,245,249,0.85))] p-6 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(15,23,42,0.7))] sm:p-10 lg:p-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle,_rgba(34,197,94,0.22),_transparent_70%)] blur-3xl lg:block" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge tone="info">Demo Data enabled</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Find opportunities in Afghanistan, faster and in one clean place.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                KaarYab helps students, fresh graduates, job seekers, women looking for remote
                work, and scholarship applicants browse verified demo opportunities with search,
                filters, saved items, and a dashboard for quick insight.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/opportunities"
                className="rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Explore opportunities
              </Link>
              <Link
                href="/add-opportunity"
                className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Submit an opportunity
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Featured" value={featured.length} hint="Highlighted listings" tone="info" />
              <StatCard
                label="Expiring soon"
                value={demoOpportunities.filter((item) => isExpiringSoon(item.deadline)).length}
                hint="Deadline pressure"
                tone="accent"
              />
              <StatCard label="Categories" value="7" hint="Jobs, scholarships, and more" tone="success" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 dark:bg-white dark:text-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300 dark:text-cyan-700">
                Platform Focus
              </p>
              <div className="mt-5 space-y-3">
                {["Searchable listings", "Save for later", "Edit and delete", "Dashboard insights"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm dark:border-slate-200"
                    >
                      <span>{item}</span>
                      <span>OK</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
                Supported Audience
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Students", "Fresh graduates", "Women", "Job seekers", "Organizations"].map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Categories"
          title="Everything a student or job seeker needs"
          description="The platform brings the most common opportunity types together so users do not need to search across multiple scattered channels."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Job",
            "Internship",
            "Scholarship",
            "Online course",
            "Remote work",
            "Training program",
            "Volunteer work",
            "Featured listings",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-lg font-semibold text-slate-950 dark:text-white">{item}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Curated listings with tags, deadlines, and a direct apply path.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Featured"
          title="Highlighted opportunities"
          description="A small preview of the latest featured listings that can drive your project demo."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} compact />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
              Next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Add or edit opportunities in a few clicks.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              The project includes localStorage persistence, responsive layout, dark mode, and a
              clean CRUD workflow so it feels like a real product, not just a demo page.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 dark:bg-[linear-gradient(135deg,#e2e8f0,#ffffff)] dark:text-slate-950"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
