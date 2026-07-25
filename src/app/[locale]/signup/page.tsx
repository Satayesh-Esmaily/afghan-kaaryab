import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SignupView from "@/components/auth/SignupView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("signupTitle"),
    description: t("signupSubtitle"),
  };
}

export default function SignupPage() {
  return <SignupView />;
}
