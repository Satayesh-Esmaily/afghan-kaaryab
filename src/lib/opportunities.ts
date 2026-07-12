export const opportunityCategories = [
  "Job",
  "Internship",
  "Scholarship",
  "Online course",
  "Remote work",
  "Training program",
  "Volunteer work",
] as const;

export const opportunityTypes = ["Remote", "On-site", "Hybrid", "Online"] as const;
export const opportunityLevels = ["Entry level", "Mid level", "Senior level", "Internship"] as const;

export type OpportunityCategory = (typeof opportunityCategories)[number];
export type OpportunityType = (typeof opportunityTypes)[number];
export type OpportunityLevel = (typeof opportunityLevels)[number];

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location: string;
  type: OpportunityType;
  publishedAt?: string;
  gender?: "Male" | "Female" | "Open to all";
  level?: OpportunityLevel;
  deadline: string;
  description: string;
  responsibilities?: string[];
  requirements: string[];
  skills?: string[];
  documentsRequired?: string[];
  companySummary?: string;
  applyLink: string;
  tags: string[];
  featured?: boolean;
  submittedAt?: string;
}

export type OpportunityInput = Omit<Opportunity, "id" | "submittedAt">;

export const deadlineFilters = [
  { value: "all", label: "Any deadline" },
  { value: "7", label: "Next 7 days" },
  { value: "14", label: "Next 14 days" },
  { value: "30", label: "Next 30 days" },
  { value: "expired", label: "Expired" },
] as const;

export type DeadlineFilter = (typeof deadlineFilters)[number]["value"];

export function createOpportunityId() {
  return `opp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDeadline(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPublishedDate(value?: string) {
  if (!value) return "Not specified";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function daysUntilDeadline(value: string) {
  const target = new Date(value);
  const today = new Date();
  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((utcTarget - utcToday) / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(value: string, windowDays = 14) {
  const days = daysUntilDeadline(value);
  return days >= 0 && days <= windowDays;
}

export function matchesDeadlineFilter(value: string, filter: DeadlineFilter) {
  const days = daysUntilDeadline(value);

  if (filter === "all") return true;
  if (filter === "expired") return days < 0;
  return days >= 0 && days <= Number(filter);
}

export function matchesPublishedAfterFilter(value: string | undefined, filter: string) {
  if (!filter) return true;
  if (!value) return false;

  return value.slice(0, 10) >= filter;
}

export function isRemoteOpportunity(opportunity: Opportunity) {
  return opportunity.type === "Remote" || opportunity.location.toLowerCase() === "online";
}

export function countByCategory(opportunities: Opportunity[], category: OpportunityCategory) {
  return opportunities.filter((item) => item.category === category).length;
}

export function getDashboardStats(opportunities: Opportunity[]) {
  const remote = opportunities.filter(isRemoteOpportunity).length;
  const expiringSoon = opportunities.filter((item) => isExpiringSoon(item.deadline)).length;
  const jobs = countByCategory(opportunities, "Job");
  const internships = countByCategory(opportunities, "Internship");
  const scholarships = countByCategory(opportunities, "Scholarship");

  const recent = [...opportunities]
    .sort((a, b) => {
      const aDate = new Date(a.submittedAt ?? a.deadline).getTime();
      const bDate = new Date(b.submittedAt ?? b.deadline).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);

  const categories = opportunityCategories.map((category) => ({
    label: category,
    value: countByCategory(opportunities, category),
  }));

  return {
    total: opportunities.length,
    jobs,
    internships,
    scholarships,
    remote,
    expiringSoon,
    recent,
    categories,
  };
}

export function getOpportunityById(opportunities: Opportunity[], id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}
