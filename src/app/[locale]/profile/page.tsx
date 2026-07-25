import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfileView from "@/components/profile/ProfileView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("navigation.pages.profile");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function ProfilePage() {
  return <ProfileView />;
}
