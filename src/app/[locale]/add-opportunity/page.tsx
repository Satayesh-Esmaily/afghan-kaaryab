import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AddOpportunityView from "@/components/opportunities/AddOpportunityView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("addOpportunity.page");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AddOpportunityPage() {
  return <AddOpportunityView />;
}
