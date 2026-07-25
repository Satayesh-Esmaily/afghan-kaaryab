"use client";

import { useTranslations } from "next-intl";
import { EmptyListCard, EntriesHeader, DocumentCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { DocumentEntry } from "@/lib/app-state";
import type { UseFormRegister } from "react-hook-form";
import type { ProfileFormValues } from "@/lib/schemas";

type ProfileDocumentsSectionProps = {
  entries: DocumentEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
  register: UseFormRegister<ProfileFormValues>;
};

export function ProfileDocumentsSection({ entries, onAdd, onEdit, onDelete, register }: ProfileDocumentsSectionProps) {
  const t = useTranslations("profile.documents");

  return (
    <ProfileSection title={t("sectionTitle")} description={t("sectionDescription")}>
      <EntriesHeader actionLabel={t("add")} onAction={onAdd} />

      <input {...register("documents")} type="hidden" />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <DocumentCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => void onDelete(index)} />
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
