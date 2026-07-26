"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const pendingWriteRef = useRef<Promise<unknown>>(Promise.resolve());

  const enqueueWrite = useCallback((task: () => Promise<unknown>) => {
    const nextWrite = pendingWriteRef.current.then(task);

    pendingWriteRef.current = nextWrite.catch((error) => {
      console.error("Failed to persist opportunity data.", error);
    });

    return nextWrite;
  }, []);

  const flushChanges = useCallback(async () => {
    await pendingWriteRef.current;
  }, []);

  useEffect(() => {
    function handlePageHide() {
      void flushChanges();
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [flushChanges]);

  const addOpportunity = useCallback(
    (input: OpportunityInput) => {
      const opportunity: Opportunity = {
        ...input,
        id: createOpportunityId(),
        submittedAt: new Date().toISOString(),
      };

      setOpportunities((current) => [opportunity, ...current]);

      if (userId) {
        void enqueueWrite(() => saveOpportunityStore(opportunity, userId));
      }

      return opportunity;
    },
    [enqueueWrite, userId]
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
          void enqueueWrite(() => saveOpportunityStore(updatedOpportunity, userId));
        }

        return next;
      });
    },
    [enqueueWrite, userId]
  );

  const deleteOpportunity = useCallback((id: string) => {
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
    setSavedIds((current) => current.filter((savedId) => savedId !== id));

    void enqueueWrite(() => deleteOpportunityStore(id));
  }, [enqueueWrite]);

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedIds((current) => {
        const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];

        if (userId) {
          void enqueueWrite(() => setSavedOpportunity(userId, id, next.includes(id)));
        }

        return next;
      });
    },
    [enqueueWrite, userId]
  );

  const clearSaved = useCallback(() => {
    setSavedIds([]);

    if (userId) {
      void enqueueWrite(() => clearSavedOpportunitiesStore(userId));
    }
  }, [enqueueWrite, userId]);

  const toggleFollowOrganization = useCallback(
    (slug: string) => {
      setFollowedOrganizationSlugs((current) => {
        const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];

        if (userId) {
          void enqueueWrite(() => setFollowedOrganization(userId, slug, next.includes(slug)));
        }

        return next;
      });
    },
    [enqueueWrite, userId]
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
      flushChanges,
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
      flushChanges,
      toggleFollowOrganization,
      toggleSaved,
      updateOpportunity,
    ]
  );
}
