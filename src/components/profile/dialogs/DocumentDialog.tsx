"use client";

import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import SearchableSelect from "@/components/common/SearchableSelect";
import { useAttachmentUpload } from "@/hooks/profile/useAttachmentUpload";
import { documentEntrySchema, type DocumentEntryFormValues } from "@/lib/schemas";
import { DialogShell, documentTypes, getDefaultDocumentEntry } from "@/components/profile/dialogs/shared";

type DocumentDialogProps = {
  open: boolean;
  initialValues: DocumentEntryFormValues | null;
  userId: string | null;
  onClose: () => void;
  onSave: (values: DocumentEntryFormValues) => void;
};

export function DocumentEntryDialog({ open, initialValues, userId, onClose, onSave }: DocumentDialogProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const {
    attachmentBusy,
    attachmentError,
    setAttachmentError,
    uploadAttachment,
  } = useAttachmentUpload({ userId, folder: "documents" });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentEntryFormValues>({
    resolver: zodResolver(documentEntrySchema),
    defaultValues: initialValues ?? getDefaultDocumentEntry(),
  });

  const attachmentFileName = useWatch({ control, name: "attachmentFileName" });
  const documentTypeValue = useWatch({ control, name: "documentType" });

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? "Edit Document" : "Add Document"} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder="National ID" />
        </FormField>

        <FormField label="Document Type" error={errors.documentType?.message}>
          <SearchableSelect
            value={documentTypeValue}
            options={documentTypes.map((type) => ({ value: type, label: type }))}
            placeholder="Select type"
            searchPlaceholder="Search document type..."
            onChange={(value) => {
              setValue("documentType", value, { shouldDirty: true, shouldValidate: true });
            }}
          />
        </FormField>

        <FormField label="Description" error={errors.description?.message} hint="Optional">
          <textarea {...register("description")} className="ds-input min-h-28" placeholder="Add notes about this document." />
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
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em]">PDF / JPG / PNG / DOC</span>
          </button>
          <input
            ref={attachmentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const input = event.currentTarget;
              const file = event.target.files?.[0];
              if (!file) return;

              setAttachmentError("");

              void uploadAttachment(file)
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
                  input.value = "";
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
