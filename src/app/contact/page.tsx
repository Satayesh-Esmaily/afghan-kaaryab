import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactDetailsCard from "@/components/contact/ContactDetailsCard";
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
        <ContactDetailsCard />

        <ContactForm />
      </div>
    </div>
  );
}
