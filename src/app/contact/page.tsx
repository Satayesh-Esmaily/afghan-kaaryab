import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactDetailsCard from "@/components/contact/ContactDetailsCard";
import { SectionHeading } from "@/components/ui";
import { contactCopy } from "@/config/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: contactCopy.pageDescription,
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={contactCopy.pageEyebrow}
        title={contactCopy.pageTitle}
        description={contactCopy.pageDescription}
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ContactDetailsCard />

        <ContactForm />
      </div>
    </div>
  );
}
