import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  if (!organization) {
    return {
      title: "Organization not found",
    };
  }

  return {
    title: organization.name,
    description: `Explore ${organization.name} and its related opportunities.`,
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
