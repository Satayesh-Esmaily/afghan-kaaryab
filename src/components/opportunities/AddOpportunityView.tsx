"use client";

import { useRouter } from "next/navigation";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import { SectionHeading } from "@/components/ui";
import { useAppData } from "@/context/app-context";
import { opportunityPageCopy } from "@/config/opportunities";

export default function AddOpportunityView() {
  const router = useRouter();
  const { addOpportunity } = useAppData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={opportunityPageCopy.addEyebrow}
        title={opportunityPageCopy.addTitle}
        description={opportunityPageCopy.addDescription}
      />

      <OpportunityForm
        submitLabel={opportunityPageCopy.addSubmitLabel}
        onSubmit={(values) => {
          const created = addOpportunity(values);
          router.push(`/opportunities/${created.id}`);
        }}
      />
    </div>
  );
}
