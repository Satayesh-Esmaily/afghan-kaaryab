"use client";

import { createContext, useContext } from "react";
import type { Opportunity, OpportunityInput } from "@/lib/opportunities";

export type OpportunitiesContextValue = {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
  addOpportunity: (input: OpportunityInput) => Opportunity;
  updateOpportunity: (id: string, input: OpportunityInput) => void;
  deleteOpportunity: (id: string) => void;
  toggleSaved: (id: string) => void;
  clearSaved: () => void;
  isSaved: (id: string) => boolean;
  toggleFollowOrganization: (slug: string) => void;
  isFollowingOrganization: (slug: string) => boolean;
};

const OpportunitiesContext = createContext<OpportunitiesContextValue | null>(null);

export function OpportunitiesContextProvider({
  value,
  children,
}: {
  value: OpportunitiesContextValue;
  children: React.ReactNode;
}) {
  return <OpportunitiesContext.Provider value={value}>{children}</OpportunitiesContext.Provider>;
}

export function useOpportunitiesContext() {
  const value = useContext(OpportunitiesContext);

  if (!value) {
    throw new Error("useOpportunitiesContext must be used within OpportunitiesContextProvider");
  }

  return value;
}
