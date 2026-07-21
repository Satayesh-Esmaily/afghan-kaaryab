"use client";

import { useRouter } from "next/navigation";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import { SectionHeading } from "@/components/ui";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { opportunityPageCopy } from "@/config/opportunities";

export default function AddOpportunityView() {
  const router = useRouter();
  const { addOpportunity } = useOpportunitiesContext();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={opportunityPageCopy.addEyebrow}
        title={opportunityPageCopy.addTitle}
        description={opportunityPageCopy.addDescription}
      />

      <OpportunityForm
        key="add-opportunity-form"
        submitLabel={opportunityPageCopy.addSubmitLabel}
        onSubmit={(values) => {
          const created = addOpportunity(values);
          router.push(`/opportunities/${created.id}`);
        }}
      />
    </div>
  );
}
