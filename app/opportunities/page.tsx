import type { Metadata } from "next";
import OpportunityBrowser from "@/components/opportunities/OpportunityBrowser";
import { demoOpportunities } from "@/data/opportunities";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Browse, search, and filter all opportunities listed on KaarYab Afghanistan.",
};

export default function OpportunitiesPage() {
  return <OpportunityBrowser opportunities={demoOpportunities} />;
}
