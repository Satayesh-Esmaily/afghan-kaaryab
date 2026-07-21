"use client";

import { EmptyListCard, EntriesHeader, ExperienceCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { ExperienceEntry } from "@/lib/app-state";

type ProfileExperienceSectionProps = {
  entries: ExperienceEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export function ProfileExperienceSection({ entries, onAdd, onEdit, onDelete }: ProfileExperienceSectionProps) {
  return (
    <ProfileSection title="Work Experience" description="List your previous roles and responsibilities.">
      <EntriesHeader actionLabel="Add Experience" onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <ExperienceCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} />
          ))
        ) : (
          <EmptyListCard
            title="No experience added yet"
            description="Add your latest roles, companies, and responsibilities."
            actionLabel="Add Experience"
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
