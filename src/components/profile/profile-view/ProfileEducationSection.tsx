"use client";

import { EmptyListCard, EntriesHeader, EducationCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { EducationEntry } from "@/lib/app-state";

type ProfileEducationSectionProps = {
  entries: EducationEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export function ProfileEducationSection({ entries, onAdd, onEdit, onDelete }: ProfileEducationSectionProps) {
  return (
    <ProfileSection title="Education" description="Add your educational background.">
      <EntriesHeader actionLabel="Add Education" onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <EducationCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} />
          ))
        ) : (
          <EmptyListCard
            title="No education added yet"
            description="Add your degrees, institutes, and field of study."
            actionLabel="Add Education"
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
