import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ResumeBuilderView from "@/components/profile/ResumeBuilderView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("navigation.pages.resumeBuilder");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function ResumeBuilderPage() {
  return <ResumeBuilderView />;
}
