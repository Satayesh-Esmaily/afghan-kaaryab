import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {cards.map((item) => (
          <div key={item.title} className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="info">{item.title}</Badge>
            <p className="ds-muted mt-4 text-sm leading-7">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="ds-card rounded-[1.5rem] p-6 sm:p-8">
        <h2 className="ds-title text-2xl font-semibold">{t("summary.title")}</h2>
        <p className="ds-muted mt-4 max-w-3xl text-base leading-7">{t("summary.body")}</p>
      </section>
    </div>
  );
}
