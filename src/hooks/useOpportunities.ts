"use client";

import { useCallback, useMemo, useState } from "react";
import { createOpportunityId, type Opportunity, type OpportunityInput } from "@/lib/opportunities";
import {
  clearSavedOpportunitiesStore,
  deleteOpportunityStore,
  saveOpportunityStore,
  setFollowedOrganization,
  setSavedOpportunity,
} from "@/lib/supabase-app-store";

type UseOpportunitiesStateInput = {
  opportunities: Opportunity[];
  savedIds: string[];
  followedOrganizationSlugs: string[];
  userId: string | null;
};

export function useOpportunitiesState({
  opportunities: initialOpportunities,
  savedIds: initialSavedIds,
  followedOrganizationSlugs: initialFollowedOrganizationSlugs,
  userId,
}: UseOpportunitiesStateInput) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
  const [followedOrganizationSlugs, setFollowedOrganizationSlugs] = useState<string[]>(
    initialFollowedOrganizationSlugs
  );

  const addOpportunity = useCallback(
    (input: OpportunityInput) => {
      const opportunity: Opportunity = {
        ...input,
        id: createOpportunityId(),
        submittedAt: new Date().toISOString(),
      };

      setOpportunities((current) => [opportunity, ...current]);

      if (userId) {
        void saveOpportunityStore(opportunity, userId);
      }

      return opportunity;
    },
    [userId]
  );

  const updateOpportunity = useCallback(
    (id: string, input: OpportunityInput) => {
      setOpportunities((current) => {
        const next = current.map((opportunity) =>
          opportunity.id === id
            ? {
                ...opportunity,
                ...input,
              }
            : opportunity
        );

        const updatedOpportunity = next.find((item) => item.id === id);
        if (updatedOpportunity && userId) {
          void saveOpportunityStore(updatedOpportunity, userId);
        }

        return next;
      });
    },
    [userId]
  );

  const deleteOpportunity = useCallback((id: string) => {
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
    setSavedIds((current) => current.filter((savedId) => savedId !== id));

    void deleteOpportunityStore(id);
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedIds((current) => {
        const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];

        if (userId) {
          void setSavedOpportunity(userId, id, next.includes(id));
        }

        return next;
      });
    },
    [userId]
  );

  const clearSaved = useCallback(() => {
    setSavedIds([]);

    if (userId) {
      void clearSavedOpportunitiesStore(userId);
    }
  }, [userId]);

  const toggleFollowOrganization = useCallback(
    (slug: string) => {
      setFollowedOrganizationSlugs((current) => {
        const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];

        if (userId) {
          void setFollowedOrganization(userId, slug, next.includes(slug));
        }

        return next;
      });
    },
    [userId]
  );

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);
  const isFollowingOrganization = useCallback(
    (slug: string) => followedOrganizationSlugs.includes(slug),
    [followedOrganizationSlugs]
  );

  return useMemo(
    () => ({
      opportunities,
      savedIds,
      followedOrganizationSlugs,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      toggleSaved,
      clearSaved,
      isSaved,
      toggleFollowOrganization,
      isFollowingOrganization,
    }),
    [
      addOpportunity,
      clearSaved,
      deleteOpportunity,
      followedOrganizationSlugs,
      isFollowingOrganization,
      isSaved,
      opportunities,
      savedIds,
      toggleFollowOrganization,
      toggleSaved,
      updateOpportunity,
    ]
  );
}
