"use client";

import { useTranslations } from "next-intl";
import { EmptyListCard, EntriesHeader, CertificationCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { CertificationEntry } from "@/lib/app-state";

type ProfileCertificationSectionProps = {
  entries: CertificationEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
};

export function ProfileCertificationSection({
  entries,
  onAdd,
  onEdit,
  onDelete,
}: ProfileCertificationSectionProps) {
  const t = useTranslations("profile.certifications");

  return (
    <ProfileSection title={t("sectionTitle")} description={t("sectionDescription")}>
      <EntriesHeader actionLabel={t("add")} onAction={onAdd} />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <CertificationCard
              key={entry.id}
              entry={entry}
              onEdit={() => onEdit(index)}
              onDelete={() => void onDelete(index)}
            />
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
