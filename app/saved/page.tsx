import type { Metadata } from "next";
import SavedOpportunitiesView from "@/components/opportunities/SavedOpportunitiesView";

export const metadata: Metadata = {
  title: "Saved Opportunities",
  description: "View all opportunities you saved for later on KaarYab Afghanistan.",
};

export default function SavedPage() {
  return <SavedOpportunitiesView />;
}
