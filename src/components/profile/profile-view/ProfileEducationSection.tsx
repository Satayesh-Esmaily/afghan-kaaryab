"use client";

import { useTranslations } from "next-intl";
import { EmptyListCard, EntriesHeader, EducationCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { EducationEntry } from "@/lib/app-state";

type ProfileEducationSectionProps = {
  entries: EducationEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export function ProfileEducationSection({ entries, onAdd, onEdit, onDelete }: ProfileEducationSectionProps) {
  const t = useTranslations("profile.education");

  return (
    <ProfileSection title={t("sectionTitle")} description={t("sectionDescription")}>
      <EntriesHeader actionLabel={t("add")} onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <EducationCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => onDelete(index)} />
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
