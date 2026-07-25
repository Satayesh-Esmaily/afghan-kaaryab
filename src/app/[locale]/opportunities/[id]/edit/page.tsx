import type { Metadata } from "next";
import { demoOpportunities } from "@/data/opportunities";
import EditOpportunityView from "@/components/opportunities/EditOpportunityView";
import { getOpportunityById } from "@/lib/opportunities";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const opportunity = getOpportunityById(demoOpportunities, id);

  return {
    title: opportunity ? `Edit ${opportunity.title}` : "Edit Opportunity",
    description: "Edit the selected opportunity.",
  };
}

export default async function EditOpportunityPage({ params }: Props) {
  const { id } = await params;
  return <EditOpportunityView id={id} />;
}
