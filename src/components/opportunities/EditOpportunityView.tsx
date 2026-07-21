"use client";

import { useRouter } from "next/navigation";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import { EmptyState, SectionHeading } from "@/components/ui";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { getOpportunityById } from "@/lib/opportunities";

export default function EditOpportunityView({ id }: { id: string }) {
  const router = useRouter();
  const { opportunities, updateOpportunity } = useOpportunitiesContext();
  const opportunity = getOpportunityById(opportunities, id);

  if (!opportunity) {
    return (
      <EmptyState
        title="Opportunity not found"
        description="The item you are trying to edit no longer exists."
        actionHref="/opportunities"
        actionLabel="Back to opportunities"
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Edit"
        title="Update opportunity details"
        description="Keep the opportunity information accurate so students and job seekers can trust the listing."
      />

      <OpportunityForm
        key={opportunity.id}
        initialValues={opportunity}
        submitLabel="Save changes"
        onSubmit={(values) => {
          updateOpportunity(opportunity.id, values);
          router.push(`/opportunities/${opportunity.id}`);
        }}
      />
    </div>
  );
}
