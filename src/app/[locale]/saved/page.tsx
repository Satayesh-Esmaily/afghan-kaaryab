import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SavedOpportunitiesView from "@/components/opportunities/SavedOpportunitiesView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("opportunities.saved");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SavedPage() {
  return <SavedOpportunitiesView />;
}
