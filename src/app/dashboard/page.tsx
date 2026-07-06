import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Inspect opportunity statistics, recent submissions, and the platform overview.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
