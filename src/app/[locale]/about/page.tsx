import type { Metadata } from "next";
import { Badge, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what KaarYab Afghanistan is and why it was built.",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="About"
        title="Why KaarYab Afghanistan exists"
        description="KaarYab helps Afghan job seekers find trusted opportunities in one organized platform."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Problem",
            body: "Opportunities are often scattered across social media, groups, and different websites.",
          },
          {
            title: "Solution",
            body: "KaarYab centralizes opportunities with search, filters, saved items, and organization pages.",
          },
          {
            title: "Audience",
            body: "Students, graduates, job seekers, women seeking remote work, and organizations sharing listings.",
          },
        ].map((item) => (
          <div key={item.title} className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="info">{item.title}</Badge>
            <p className="ds-muted mt-4 text-sm leading-7">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="ds-card rounded-[1.5rem] p-6 sm:p-8">
        <h2 className="ds-title text-2xl font-semibold">Built as a practical job platform</h2>
        <p className="ds-muted mt-4 max-w-3xl text-base leading-7">
          The application includes responsive layouts, dynamic routes, saved opportunities,
          organization profiles, a full add/edit/delete workflow, dark mode, and reusable
          components so it feels ready for everyday use.
        </p>
      </section>
    </div>
  );
}
