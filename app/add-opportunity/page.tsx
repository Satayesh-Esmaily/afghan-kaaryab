import type { Metadata } from "next";
import AddOpportunityView from "@/components/opportunities/AddOpportunityView";

export const metadata: Metadata = {
  title: "Add Opportunity",
  description: "Submit a new opportunity to the KaarYab Afghanistan platform.",
};

export default function AddOpportunityPage() {
  return <AddOpportunityView />;
}
