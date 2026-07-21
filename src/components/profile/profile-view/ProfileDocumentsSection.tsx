"use client";

import { EmptyListCard, EntriesHeader, DocumentCard, ProfileSection } from "@/components/profile/profile-view/ProfileViewParts";
import type { DocumentEntry } from "@/lib/app-state";
import type { UseFormRegister } from "react-hook-form";
import FormField from "@/components/common/FormField";
import type { ProfileFormValues } from "@/lib/schemas";

type ProfileDocumentsSectionProps = {
  entries: DocumentEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
  register: UseFormRegister<ProfileFormValues>;
};

export function ProfileDocumentsSection({ entries, onAdd, onEdit, onDelete, register }: ProfileDocumentsSectionProps) {
  return (
    <ProfileSection title="Supporting Documents" description="Keep your documents ready for applications.">
      <EntriesHeader actionLabel="Add Document" onAction={onAdd} />

      <input {...register("documents")} type="hidden" />

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <DocumentCard key={entry.id} entry={entry} onEdit={() => onEdit(index)} onDelete={() => void onDelete(index)} />
          ))
        ) : (
          <EmptyListCard
            title="No documents added yet"
            description="Upload CVs, IDs, passports, transcripts, or other supporting files."
            actionLabel="Add Document"
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
