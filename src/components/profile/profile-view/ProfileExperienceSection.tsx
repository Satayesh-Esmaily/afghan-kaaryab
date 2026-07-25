"use client";

import { useTranslations } from "next-intl";
import { EmptyListCard, EntriesHeader, ExperienceCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { ExperienceEntry } from "@/lib/app-state";

type ProfileExperienceSectionProps = {
  entries: ExperienceEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export function ProfileExperienceSection({ entries, onAdd, onEdit, onDelete }: ProfileExperienceSectionProps) {
  const t = useTranslations("profile.experience");

  return (
    <ProfileSection title={t("sectionTitle")} description={t("sectionDescription")}>
      <EntriesHeader actionLabel={t("add")} onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <ExperienceCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} />
          ))
        ) : (
          <EmptyListCard
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            actionLabel={t("add")}
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
