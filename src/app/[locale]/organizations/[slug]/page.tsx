import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import OrganizationDetailsView from "@/components/network/OrganizationDetailsView";
import { demoOpportunities } from "@/data/opportunities";
import { getOrganizationProfile } from "@/lib/network";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const organization = getOrganizationProfile(demoOpportunities, slug);
  const t = await getTranslations("network.detail");

  if (!organization) {
    return {
      title: t("organizationNotFound"),
    };
  }

  return {
    title: organization.name,
    description: t("description", { name: organization.name }),
  };
}

export default async function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organization = getOrganizationProfile(demoOpportunities, slug);

  if (!organization) {
    notFound();
  }

  return <OrganizationDetailsView organization={organization} />;
}
