import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your KaarYab Afghanistan account.",
};

export default function LoginPage() {
  return <LoginView />;
}
