import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import ContactDetailsCard from "@/components/contact/ContactDetailsCard";
import { SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ContactDetailsCard />
        <ContactForm />
      </div>
    </div>
  );
}
