"use client";

import { EmptyListCard, EntriesHeader, AwardCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { AwardEntry } from "@/lib/app-state";

type ProfileAwardSectionProps = {
  entries: AwardEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
};

export function ProfileAwardSection({ entries, onAdd, onEdit, onDelete }: ProfileAwardSectionProps) {
  return (
    <ProfileSection title="Awards" description="Highlight achievements and recognitions.">
      <EntriesHeader actionLabel="Add Award" onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <AwardCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => void onDelete(index)} />
          ))
        ) : (
          <EmptyListCard
            title="No awards added yet"
            description="Add awards, recognition, and attachment files."
            actionLabel="Add Award"
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
