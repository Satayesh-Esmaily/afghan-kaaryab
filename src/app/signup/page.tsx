import type { Metadata } from "next";
import SignupView from "@/components/auth/SignupView";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your KaarYab Afghanistan account.",
};

export default function SignupPage() {
  return <SignupView />;
}
