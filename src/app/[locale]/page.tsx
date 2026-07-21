import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DashboardView from "@/components/dashboard/DashboardView";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return {
    title: t("siteName"),
    description: t("description"),
  };
}

export default function LocaleHomePage() {
  return <DashboardView />;
}
