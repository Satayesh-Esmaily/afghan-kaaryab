import type { Opportunity } from "@/lib/opportunities";

export type OrganizationEntry = {
  slug: string;
  name: string;
  count: number;
  categories: string[];
  locations: string[];
  featuredCount: number;
};

export type OrganizationProfile = OrganizationEntry & {
  opportunities: Opportunity[];
};

export type CountryEntry = {
  name: string;
  count: number;
  locations: string[];
};

export type InstitutionEntry = {
  name: string;
  count: number;
  examples: string[];
};

export function slugifyOrganizationName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getOrganizationEntries(opportunities: Opportunity[]) {
  const groups = new Map<string, OrganizationEntry>();

  opportunities.forEach((opportunity) => {
    const existing = groups.get(opportunity.organization);

    if (existing) {
      existing.count += 1;
      existing.categories = addUnique(existing.categories, opportunity.category);
      existing.locations = addUnique(existing.locations, opportunity.location);
      existing.featuredCount += opportunity.featured ? 1 : 0;
      return;
    }

    groups.set(opportunity.organization, {
      slug: slugifyOrganizationName(opportunity.organization),
      name: opportunity.organization,
      count: 1,
      categories: [opportunity.category],
      locations: [opportunity.location],
      featuredCount: opportunity.featured ? 1 : 0,
    });
  });

  return [...groups.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

export function getOrganizationProfile(opportunities: Opportunity[], slug: string) {
  const entries = getOrganizationEntries(opportunities);
  const organization = entries.find((entry) => entry.slug === slug);

  if (!organization) return null;

  return {
    ...organization,
    opportunities: opportunities.filter(
      (opportunity) => slugifyOrganizationName(opportunity.organization) === slug
    ),
  } satisfies OrganizationProfile;
}

export function getCountryEntries(opportunities: Opportunity[]) {
  const groups = new Map<string, CountryEntry>();

  opportunities.forEach((opportunity) => {
    const country = inferCountry(opportunity.location);
    const existing = groups.get(country);

    if (existing) {
      existing.count += 1;
      existing.locations = addUnique(existing.locations, opportunity.location);
      return;
    }

    groups.set(country, {
      name: country,
      count: 1,
      locations: [opportunity.location],
    });
  });

  return [...groups.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

export function getInstitutionEntries(opportunities: Opportunity[]) {
  const groups = new Map<string, InstitutionEntry>();

  opportunities.forEach((opportunity) => {
    const institution = inferInstitution(opportunity.organization);
    const existing = groups.get(institution);

    if (existing) {
      existing.count += 1;
      existing.examples = addUnique(existing.examples, opportunity.organization);
      return;
    }

    groups.set(institution, {
      name: institution,
      count: 1,
      examples: [opportunity.organization],
    });
  });

  return [...groups.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function inferCountry(location: string) {
  if (location === "Online" || location === "Remote") {
    return "Global Remote";
  }

  return "Afghanistan";
}

function inferInstitution(organization: string) {
  const normalized = organization.toLowerCase();

  if (normalized.includes("foundation")) return "Foundation";
  if (normalized.includes("community")) return "Community";
  if (normalized.includes("media")) return "Media";
  if (normalized.includes("network")) return "Network";
  if (normalized.includes("hub")) return "Hub";
  if (normalized.includes("commerce")) return "Commerce";
  if (normalized.includes("bridge")) return "NGO";
  if (normalized.includes("skill")) return "Training platform";

  return "Institution";
}

function addUnique(items: string[], value: string) {
  return items.includes(value) ? items : [...items, value];
}
