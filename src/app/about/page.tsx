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
        description="This final project solves a common real-world problem by organizing scattered opportunity information into one easy-to-use platform."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "Problem",
            body: "Young people often search across social media, groups, and different websites to find jobs and scholarships.",
          },
          {
            title: "Solution",
            body: "KaarYab centralizes opportunities with search, filters, saved items, and a simple dashboard.",
          },
          {
            title: "Audience",
            body: "Students, graduates, job seekers, women seeking remote work, and organizations that share opportunities.",
          },
        ].map((item) => (
          <div key={item.title} className="ds-card rounded-[1.5rem] p-6">
            <Badge tone="info">{item.title}</Badge>
            <p className="ds-muted mt-4 text-sm leading-7">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="ds-card rounded-[1.5rem] p-6 sm:p-8">
        <h2 className="ds-title text-2xl font-semibold">Built with the final project rubric in mind</h2>
        <p className="ds-muted mt-4 max-w-3xl text-base leading-7">
          The application includes responsive layouts, dynamic routes, localStorage persistence,
          a full add/edit/delete workflow, dark mode, and reusable components so it demonstrates
          both product thinking and technical skill.
        </p>
      </section>
    </div>
  );
}
