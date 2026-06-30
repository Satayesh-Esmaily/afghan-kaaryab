import type { Metadata } from "next";
import { demoOpportunities } from "@/data/opportunities";
import OpportunityDetails from "@/components/opportunities/OpportunityDetails";
import { getOpportunityById } from "@/lib/opportunities";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const opportunity = getOpportunityById(demoOpportunities, id);

  return {
    title: opportunity ? opportunity.title : "Opportunity Details",
    description: opportunity
      ? `${opportunity.title} at ${opportunity.organization} in ${opportunity.location}.`
      : "View full details about a single opportunity.",
  };
}

export default function OpportunityDetailsPage() {
  return <OpportunityDetails />;
}
