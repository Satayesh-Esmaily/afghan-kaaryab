import type { Metadata } from "next";
import ResumeBuilderView from "@/components/profile/ResumeBuilderView";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build and export a job-ready resume on KaarYab Afghanistan.",
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderView />;
}
