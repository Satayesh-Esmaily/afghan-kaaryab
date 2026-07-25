"use client";

import { useTranslations } from "next-intl";
import { EmptyListCard, EntriesHeader, AwardCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { AwardEntry } from "@/lib/app-state";

type ProfileAwardSectionProps = {
  entries: AwardEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
};

export function ProfileAwardSection({ entries, onAdd, onEdit, onDelete }: ProfileAwardSectionProps) {
  const t = useTranslations("profile.awards");

  return (
    <ProfileSection title={t("sectionTitle")} description={t("sectionDescription")}>
      <EntriesHeader actionLabel={t("add")} onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <AwardCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => void onDelete(index)} />
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
