import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";
import { authCopy } from "@/config/auth";

export const metadata: Metadata = {
  title: "Login",
  description: authCopy.loginDescription,
};

export default function LoginPage() {
  return <LoginView />;
}
