import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginView from "@/components/auth/LoginView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("loginTitle"),
    description: t("loginSubtitle"),
  };
}

export default function LoginPage() {
  return <LoginView />;
}
