import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import OpportunityBrowser from "@/components/opportunities/OpportunityBrowser";
import { demoOpportunities } from "@/data/opportunities";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("opportunities.page");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function OpportunitiesPage() {
  return <OpportunityBrowser opportunities={demoOpportunities} />;
}
