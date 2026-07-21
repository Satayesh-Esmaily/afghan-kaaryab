"use client";

import type { ReactNode } from "react";
import {
  type AwardEntryFormValues,
  type CertificationEntryFormValues,
  type DocumentEntryFormValues,
  type EducationEntryFormValues,
  type ExperienceEntryFormValues,
} from "@/lib/schemas";

export const employmentTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"] as const;
export const documentTypes = ["CV", "National ID", "Passport", "Certificate", "Transcript", "Other"] as const;

export function DialogShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8 backdrop-blur-sm sm:items-center">
      <div className="ds-card relative w-full max-w-5xl rounded-[1.75rem] bg-[color:var(--surface)] p-5 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-xl text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground)]"
          aria-label="Close dialog"
        >
          x
        </button>
        <div className="pe-10">
          <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{title}</h3>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function getDefaultExperienceEntry(): ExperienceEntryFormValues {
  return {
    position: "",
    organization: "",
    employmentType: "",
    currentlyWorking: false,
    startDate: "",
    endDate: "",
    country: "",
    province: "",
    skills: "",
    description: "",
  };
}

export function getDefaultEducationEntry(): EducationEntryFormValues {
  return {
    degree: "",
    institution: "",
    fieldOfStudy: "",
    country: "",
    province: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function getDefaultCertificationEntry(): CertificationEntryFormValues {
  return {
    title: "",
    certificationUrl: "",
    credentialId: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    description: "",
    attachmentUrl: "",
    attachmentStoragePath: "",
    attachmentFileName: "",
  };
}

export function getDefaultAwardEntry(): AwardEntryFormValues {
  return {
    title: "",
    issuedBy: "",
    date: "",
    description: "",
    referenceUrl: "",
    attachmentUrl: "",
    attachmentStoragePath: "",
    attachmentFileName: "",
  };
}

export function getDefaultDocumentEntry(): DocumentEntryFormValues {
  return {
    title: "",
    documentType: "",
    description: "",
    attachmentUrl: "",
    attachmentStoragePath: "",
    attachmentFileName: "",
  };
}
