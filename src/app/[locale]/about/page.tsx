import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.page");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const cards = [
    {
      title: t("cards.problem.title"),
      body: t("cards.problem.body"),
    },
    {
      title: t("cards.solution.title"),
      body: t("cards.solution.body"),
    },
    {
      title: t("cards.audience.title"),
      body: t("cards.audience.body"),
    },
  ];
  const highlights = [
    {
      title: t("highlights.items.search.title"),
      body: t("highlights.items.search.body"),
    },
    {
      title: t("highlights.items.save.title"),
      body: t("highlights.items.save.body"),
    },
    {
      title: t("highlights.items.profile.title"),
      body: t("highlights.items.profile.body"),
    },
    {
      title: t("highlights.items.directory.title"),
      body: t("highlights.items.directory.body"),
    },
  ];
  const workflow = [
    {
      step: "01",
      title: t("workflow.steps.one.title"),
      body: t("workflow.steps.one.body"),
    },
    {
      step: "02",
      title: t("workflow.steps.two.title"),
      body: t("workflow.steps.two.body"),
    },
    {
      step: "03",
      title: t("workflow.steps.three.title"),
      body: t("workflow.steps.three.body"),
    },
    {
      step: "04",
      title: t("workflow.steps.four.title"),
      body: t("workflow.steps.four.body"),
    },
  ];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ds-card rounded-[1.5rem] p-6 sm:p-8">
          <Badge tone="accent">{t("highlights.title")}</Badge>
          <p className="ds-muted mt-4 max-w-2xl text-sm leading-7">{t("highlights.description")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                <h3 className="text-base font-semibold text-[color:var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--foreground-muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="success">{t("workflow.title")}</Badge>
            <p className="ds-muted mt-4 text-sm leading-7">{t("workflow.description")}</p>
            <div className="mt-5 space-y-3">
              {workflow.map((item) => (
                <div key={item.step} className="flex gap-4 rounded-[1.15rem] bg-[color:var(--surface-soft)] px-4 py-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--accent-soft)] text-sm font-semibold text-[color:var(--accent-strong)]">
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[color:var(--foreground)]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--foreground-muted)]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {cards.map((item) => (
          <div key={item.title} className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="info">{item.title}</Badge>
            <p className="ds-muted mt-4 text-sm leading-7">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="ds-card rounded-[1.5rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="ds-title text-2xl font-semibold">{t("summary.title")}</h2>
            <p className="ds-muted mt-4 max-w-3xl text-base leading-7">{t("summary.body")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-lg"
            >
              {t("cta.primary")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
            >
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
