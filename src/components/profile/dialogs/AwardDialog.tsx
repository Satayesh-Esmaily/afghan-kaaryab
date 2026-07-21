"use client";

import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "@/components/common/DatePickerField";
import FormField from "@/components/common/FormField";
import { useAttachmentUpload } from "@/hooks/profile/useAttachmentUpload";
import { awardEntrySchema, type AwardEntryFormValues } from "@/lib/schemas";
import { DialogShell, getDefaultAwardEntry } from "@/components/profile/dialogs/shared";

type AwardDialogProps = {
  open: boolean;
  initialValues: AwardEntryFormValues | null;
  userId: string | null;
  onClose: () => void;
  onSave: (values: AwardEntryFormValues) => void;
};

export function AwardEntryDialog({ open, initialValues, userId, onClose, onSave }: AwardDialogProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const {
    attachmentBusy,
    attachmentError,
    setAttachmentError,
    uploadAttachment,
  } = useAttachmentUpload({ userId, folder: "awards" });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AwardEntryFormValues>({
    resolver: zodResolver(awardEntrySchema),
    defaultValues: initialValues ?? getDefaultAwardEntry(),
  });

  const attachmentFileName = useWatch({ control, name: "attachmentFileName" });
  const awardDateValue = useWatch({ control, name: "date" });

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
            <DatePickerField
              value={awardDateValue}
              onChange={(value) => setValue("date", value, { shouldDirty: true, shouldValidate: true })}
              placeholder="Select date"
            />
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
            className="flex w-full items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-start text-sm text-[color:var(--foreground-muted)]"
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
