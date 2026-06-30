import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message or suggestion to improve the KaarYab Afghanistan platform.",
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Contact"
        title="Send feedback or a new opportunity"
        description="Use this form if you want to suggest a feature, report a problem, or share an opportunity idea."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Contact details</h2>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            This project version is a demo, so the form is intentionally local and safe to use during presentations.
          </p>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Email: hello@kaaryab.af</p>
            <p>Location: Afghanistan</p>
            <p>Purpose: opportunity discovery for youth and communities</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
