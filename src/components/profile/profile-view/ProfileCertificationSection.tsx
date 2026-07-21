"use client";

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
  return (
    <ProfileSection
      title="Certifications"
      description="Showcase certificates and credentials that strengthen your profile."
    >
      <EntriesHeader actionLabel="Add Certification" onAction={onAdd} />

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
            title="No certifications added yet"
            description="Add certificates, credential IDs, and attachments."
            actionLabel="Add Certification"
            onAction={onAdd}
          />
        )}
      </div>
    </ProfileSection>
  );
}
