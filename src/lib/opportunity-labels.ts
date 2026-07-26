import type {
  OpportunityCategory,
  OpportunityLevel,
  OpportunityType,
} from "@/lib/opportunities";

export const opportunityCategoryLabelKeys: Record<OpportunityCategory, string> = {
  Job: "categories.Job",
  Internship: "categories.Internship",
  Scholarship: "categories.Scholarship",
  "Online course": "categories.Online course",
  "Remote work": "categories.Remote work",
  "Training program": "categories.Training program",
  "Volunteer work": "categories.Volunteer work",
};

export const opportunityTypeLabelKeys: Record<OpportunityType, string> = {
  Remote: "types.Remote",
  "On-site": "types.On-site",
  Hybrid: "types.Hybrid",
  Online: "types.Online",
};

export const opportunityLevelLabelKeys: Record<OpportunityLevel, string> = {
  "Entry level": "levels.Entry level",
  "Mid level": "levels.Mid level",
  "Senior level": "levels.Senior level",
  Internship: "levels.Internship",
};

export const opportunityGenderLabelKeys: Record<"Male" | "Female" | "Open to all", string> = {
  Male: "genders.Male",
  Female: "genders.Female",
  "Open to all": "genders.Open to all",
};
