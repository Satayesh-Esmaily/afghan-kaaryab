"use client";

import { useRouter } from "next/navigation";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import { SectionHeading } from "@/components/ui";
import { useAppData } from "@/context/app-context";

export default function AddOpportunityView() {
  const router = useRouter();
  const { addOpportunity } = useAppData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Submit"
        title="Add a new opportunity"
        description="Use this form to submit jobs, internships, scholarships, and other useful opportunities for Afghan youth."
      />

      <OpportunityForm
        submitLabel="Publish opportunity"
        onSubmit={(values) => {
          const created = addOpportunity(values);
          router.push(`/opportunities/${created.id}`);
        }}
      />
    </div>
  );
}
