import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NetworkView from "@/components/network/NetworkView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("network.page");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function OrganizationsPage() {
  return <NetworkView />;
}
