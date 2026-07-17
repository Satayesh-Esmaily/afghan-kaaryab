"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import {
  awardEntrySchema,
  certificationEntrySchema,
  educationEntrySchema,
  experienceEntrySchema,
  type AwardEntryFormValues,
  type CertificationEntryFormValues,
  type EducationEntryFormValues,
  type ExperienceEntryFormValues,
} from "@/lib/schemas";
import { uploadProfileAttachment } from "@/lib/profile-attachment-storage";

type ExperienceDialogProps = {
  open: boolean;
  initialValues: ExperienceEntryFormValues | null;
  onClose: () => void;
  onSave: (values: ExperienceEntryFormValues) => void;
};

type EducationDialogProps = {
  open: boolean;
  initialValues: EducationEntryFormValues | null;
  onClose: () => void;
  onSave: (values: EducationEntryFormValues) => void;
};

type CertificationDialogProps = {
  open: boolean;
  initialValues: CertificationEntryFormValues | null;
  userId: string | null;
  onClose: () => void;
  onSave: (values: CertificationEntryFormValues) => void;
};

type AwardDialogProps = {
  open: boolean;
  initialValues: AwardEntryFormValues | null;
  userId: string | null;
  onClose: () => void;
  onSave: (values: AwardEntryFormValues) => void;
};

const employmentTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"] as const;

export function ExperienceEntryDialog({ open, initialValues, onClose, onSave }: ExperienceDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceEntryFormValues>({
    resolver: zodResolver(experienceEntrySchema),
    defaultValues: initialValues ?? getDefaultExperienceEntry(),
  });
  const currentlyWorking = watch("currentlyWorking");

  useEffect(() => {
    if (open) {
      reset(initialValues ?? getDefaultExperienceEntry());
    }
  }, [initialValues, open, reset]);

  useEffect(() => {
    if (currentlyWorking) {
      setValue("endDate", "");
    }
  }, [currentlyWorking, setValue]);

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? "Edit Experience" : "Add Experience"} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label="Position" error={errors.position?.message}>
          <input {...register("position")} className="ds-input" placeholder="Product Designer / UIUX Designer" />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Organization" error={errors.organization?.message}>
            <input {...register("organization")} className="ds-input" placeholder="Netlinks LTD" />
          </FormField>
          <FormField label="Employment Type" error={errors.employmentType?.message}>
            <select {...register("employmentType")} className="ds-input">
              <option value="">Select type</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <label className="flex items-center gap-3 rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
          <input
            type="checkbox"
            {...register("currentlyWorking")}
            className="h-4 w-4 rounded border-[color:var(--border-strong)] text-[color:var(--accent)]"
          />
          I am currently working in this role
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Start Date" error={errors.startDate?.message}>
            <input {...register("startDate")} type="date" className="ds-input" />
          </FormField>
          <FormField label="End Date" error={errors.endDate?.message}>
            <input {...register("endDate")} type="date" className="ds-input" disabled={currentlyWorking} />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Country" error={errors.country?.message}>
            <input {...register("country")} className="ds-input" placeholder="Afghanistan" />
          </FormField>
          <FormField label="Province" error={errors.province?.message}>
            <input {...register("province")} className="ds-input" placeholder="Herat" />
          </FormField>
        </div>

        <FormField label="Skills" error={errors.skills?.message} hint="Add relevant skills separated by commas">
          <input {...register("skills")} className="ds-input" placeholder="UI design, Figma, Collaboration" />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="ds-input min-h-36"
            placeholder="Duties and responsibilities"
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ds-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            Save
          </button>
        </div>
      </form>
    </DialogShell>
  );
}

export function EducationEntryDialog({ open, initialValues, onClose, onSave }: EducationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationEntryFormValues>({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: initialValues ?? getDefaultEducationEntry(),
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? getDefaultEducationEntry());
    }
  }, [initialValues, open, reset]);

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? "Edit Education" : "Add Education"} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label="Degree" error={errors.degree?.message}>
          <input {...register("degree")} className="ds-input" placeholder="Bachelor's Degree" />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Institution" error={errors.institution?.message}>
            <input {...register("institution")} className="ds-input" placeholder="Herat University" />
          </FormField>
          <FormField label="Field of Study" error={errors.fieldOfStudy?.message}>
            <input {...register("fieldOfStudy")} className="ds-input" placeholder="Civil Engineering" />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Country" error={errors.country?.message}>
            <input {...register("country")} className="ds-input" placeholder="Afghanistan" />
          </FormField>
          <FormField label="Province" error={errors.province?.message}>
            <input {...register("province")} className="ds-input" placeholder="Herat" />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Start Date" error={errors.startDate?.message}>
            <input {...register("startDate")} type="date" className="ds-input" />
          </FormField>
          <FormField label="End Date" error={errors.endDate?.message}>
            <input {...register("endDate")} type="date" className="ds-input" />
          </FormField>
        </div>

        <FormField label="Description" error={errors.description?.message} hint="Optional">
          <textarea {...register("description")} className="ds-input min-h-36" placeholder="About your education" />
        </FormField>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ds-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            Save
          </button>
        </div>
      </form>
    </DialogShell>
  );
}

export function CertificationEntryDialog({
  open,
  initialValues,
  userId,
  onClose,
  onSave,
}: CertificationDialogProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentBusy, setAttachmentBusy] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CertificationEntryFormValues>({
    resolver: zodResolver(certificationEntrySchema),
    defaultValues: initialValues ?? getDefaultCertificationEntry(),
  });

  const attachmentFileName = watch("attachmentFileName");

  useEffect(() => {
    if (open) {
      reset(initialValues ?? getDefaultCertificationEntry());
      setAttachmentError("");
    }
  }, [initialValues, open, reset]);

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? "Edit Certification" : "Add Certification"} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder="Product Designer / UIUX Designer" />
        </FormField>

        <FormField label="Certification URL" error={errors.certificationUrl?.message} hint="Optional">
          <input {...register("certificationUrl")} className="ds-input" placeholder="https://example.com/certificate" />
        </FormField>

        <FormField label="Credential ID" error={errors.credentialId?.message} hint="Optional">
          <input {...register("credentialId")} className="ds-input" placeholder="Enter credential ID" />
        </FormField>

        <FormField label="Issuing Organization" error={errors.issuingOrganization?.message}>
          <input {...register("issuingOrganization")} className="ds-input" placeholder="e.g., Google, Coursera, Microsoft" />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Issue Date" error={errors.issueDate?.message}>
            <input {...register("issueDate")} type="date" className="ds-input" />
          </FormField>
          <FormField label="Expiration Date" error={errors.expirationDate?.message} hint="Optional">
            <input {...register("expirationDate")} type="date" className="ds-input" />
          </FormField>
        </div>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register("description")} className="ds-input min-h-36" placeholder="About your certification." />
        </FormField>

        <input {...register("attachmentUrl")} type="hidden" />
        <input {...register("attachmentStoragePath")} type="hidden" />
        <input {...register("attachmentFileName")} type="hidden" />

        <div className="space-y-2">
          <p className="text-sm font-medium text-[color:var(--foreground-strong)]">Attachment</p>
          <button
            type="button"
            onClick={() => attachmentInputRef.current?.click()}
            className="flex w-full items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-left text-sm text-[color:var(--foreground-muted)]"
          >
            <span>{attachmentBusy ? "Uploading file..." : attachmentFileName || "Choose a file or drag it here to upload."}</span>
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em]">PDF / JPG / PNG</span>
          </button>
          <input
            ref={attachmentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              setAttachmentError("");
              setAttachmentBusy(true);

              void uploadProfileAttachment(file, userId ?? "", "certifications")
                .then((result) => {
                  if (!result) {
                    setAttachmentError("We could not upload the file. Please try again.");
                    return;
                  }

                  setValue("attachmentUrl", result.url, { shouldValidate: true });
                  setValue("attachmentStoragePath", result.path, { shouldValidate: true });
                  setValue("attachmentFileName", result.fileName, { shouldValidate: true });
                })
                .finally(() => {
                  setAttachmentBusy(false);
                  event.currentTarget.value = "";
                });
            }}
          />
          {attachmentError ? <p className="text-sm text-[color:var(--danger)]">{attachmentError}</p> : null}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ds-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || attachmentBusy}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            Save
          </button>
        </div>
      </form>
    </DialogShell>
  );
}

export function AwardEntryDialog({
  open,
  initialValues,
  userId,
  onClose,
  onSave,
}: AwardDialogProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentBusy, setAttachmentBusy] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AwardEntryFormValues>({
    resolver: zodResolver(awardEntrySchema),
    defaultValues: initialValues ?? getDefaultAwardEntry(),
  });

  const attachmentFileName = watch("attachmentFileName");

  useEffect(() => {
    if (open) {
      reset(initialValues ?? getDefaultAwardEntry());
      setAttachmentError("");
    }
  }, [initialValues, open, reset]);

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? "Edit Award" : "Add Award"} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder="Best Designer Award" />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Issued By" error={errors.issuedBy?.message}>
            <input {...register("issuedBy")} className="ds-input" placeholder="Netlinks LTD" />
          </FormField>
          <FormField label="Date" error={errors.date?.message}>
            <input {...register("date")} type="date" className="ds-input" />
          </FormField>
        </div>

        <FormField label="Description" error={errors.description?.message}>
          <textarea {...register("description")} className="ds-input min-h-36" placeholder="About your award" />
        </FormField>

        <FormField label="Reference Link" error={errors.referenceUrl?.message} hint="Optional">
          <input {...register("referenceUrl")} className="ds-input" placeholder="https://example.com/award" />
        </FormField>

        <input {...register("attachmentUrl")} type="hidden" />
        <input {...register("attachmentStoragePath")} type="hidden" />
        <input {...register("attachmentFileName")} type="hidden" />

        <div className="space-y-2">
          <p className="text-sm font-medium text-[color:var(--foreground-strong)]">Attachment</p>
          <button
            type="button"
            onClick={() => attachmentInputRef.current?.click()}
            className="flex w-full items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-left text-sm text-[color:var(--foreground-muted)]"
          >
            <span>{attachmentBusy ? "Uploading file..." : attachmentFileName || "Choose a file or drag it here to upload."}</span>
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em]">PDF / JPG / PNG</span>
          </button>
          <input
            ref={attachmentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              setAttachmentError("");
              setAttachmentBusy(true);

              void uploadProfileAttachment(file, userId ?? "", "awards")
                .then((result) => {
                  if (!result) {
                    setAttachmentError("We could not upload the file. Please try again.");
                    return;
                  }

                  setValue("attachmentUrl", result.url, { shouldValidate: true });
                  setValue("attachmentStoragePath", result.path, { shouldValidate: true });
                  setValue("attachmentFileName", result.fileName, { shouldValidate: true });
                })
                .finally(() => {
                  setAttachmentBusy(false);
                  event.currentTarget.value = "";
                });
            }}
          />
          {attachmentError ? <p className="text-sm text-[color:var(--danger)]">{attachmentError}</p> : null}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ds-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || attachmentBusy}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            Save
          </button>
        </div>
      </form>
    </DialogShell>
  );
}

function DialogShell({
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
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-xl text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground)]"
          aria-label="Close dialog"
        >
          ×
        </button>
        <div className="pr-10">
          <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{title}</h3>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function getDefaultExperienceEntry(): ExperienceEntryFormValues {
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

function getDefaultEducationEntry(): EducationEntryFormValues {
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

function getDefaultCertificationEntry(): CertificationEntryFormValues {
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

function getDefaultAwardEntry(): AwardEntryFormValues {
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
