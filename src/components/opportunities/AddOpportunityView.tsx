"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import OpportunityForm from "@/components/opportunities/OpportunityForm";
import { SectionHeading } from "@/components/ui";
import { useOpportunitiesContext } from "@/context/opportunities-context";

export default function AddOpportunityView() {
  const t = useTranslations("addOpportunity");
  const router = useRouter();
  const { addOpportunity } = useOpportunitiesContext();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={t("page.eyebrow")}
        title={t("page.title")}
        description={t("page.description")}
      />

      <OpportunityForm
        key="add-opportunity-form"
        submitLabel={t("page.submitLabel")}
        onSubmit={(values) => {
          const created = addOpportunity(values);
          router.push(`/opportunities/${created.id}`);
        }}
      />
    </div>
  );
}
