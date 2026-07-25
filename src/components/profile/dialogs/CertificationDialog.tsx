"use client";

import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import DatePickerField from "@/components/common/DatePickerField";
import FormField from "@/components/common/FormField";
import { useAttachmentUpload } from "@/hooks/profile/useAttachmentUpload";
import { certificationEntrySchema, type CertificationEntryFormValues } from "@/lib/schemas";
import { DialogShell, getDefaultCertificationEntry } from "@/components/profile/dialogs/shared";

type CertificationDialogProps = {
  open: boolean;
  initialValues: CertificationEntryFormValues | null;
  userId: string | null;
  onClose: () => void;
  onSave: (values: CertificationEntryFormValues) => void;
};

export function CertificationEntryDialog({
  open,
  initialValues,
  userId,
  onClose,
  onSave,
}: CertificationDialogProps) {
  const t = useTranslations("profile.dialogs.certification");
  const common = useTranslations("common");
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const {
    attachmentBusy,
    attachmentError,
    setAttachmentError,
    uploadAttachment,
  } = useAttachmentUpload({ userId, folder: "certifications" });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CertificationEntryFormValues>({
    resolver: zodResolver(certificationEntrySchema),
    defaultValues: initialValues ?? getDefaultCertificationEntry(),
  });

  const attachmentFileName = useWatch({ control, name: "attachmentFileName" });
  const issueDateValue = useWatch({ control, name: "issueDate" });
  const expirationDateValue = useWatch({ control, name: "expirationDate" });

  if (!open) return null;

  return (
    <DialogShell title={initialValues ? t("editTitle") : t("addTitle")} onClose={onClose}>
      <form
        onSubmit={handleSubmit((values) => {
          onSave(values);
          onClose();
        })}
        className="space-y-5"
      >
        <FormField label={t("title")} error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder={t("titlePlaceholder")} />
        </FormField>

        <FormField label={t("certificationUrl")} error={errors.certificationUrl?.message} hint={t("optional")}>
          <input {...register("certificationUrl")} className="ds-input" placeholder={t("certificationUrlPlaceholder")} />
        </FormField>

        <FormField label={t("credentialId")} error={errors.credentialId?.message} hint={t("optional")}>
          <input {...register("credentialId")} className="ds-input" placeholder={t("credentialIdPlaceholder")} />
        </FormField>

        <FormField label={t("issuingOrganization")} error={errors.issuingOrganization?.message}>
          <input {...register("issuingOrganization")} className="ds-input" placeholder={t("issuingOrganizationPlaceholder")} />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label={t("issueDate")} error={errors.issueDate?.message}>
            <DatePickerField
              value={issueDateValue}
              onChange={(value) => setValue("issueDate", value, { shouldDirty: true, shouldValidate: true })}
              placeholder={t("selectDate")}
            />
          </FormField>
          <FormField label={t("expirationDate")} error={errors.expirationDate?.message} hint={t("optional")}>
            <DatePickerField
              value={expirationDateValue}
              onChange={(value) => setValue("expirationDate", value, { shouldDirty: true, shouldValidate: true })}
              placeholder={t("selectDate")}
            />
          </FormField>
        </div>

        <FormField label={t("description")} error={errors.description?.message}>
          <textarea {...register("description")} className="ds-input min-h-36" placeholder={t("descriptionPlaceholder")} />
        </FormField>

        <input {...register("attachmentUrl")} type="hidden" />
        <input {...register("attachmentStoragePath")} type="hidden" />
        <input {...register("attachmentFileName")} type="hidden" />

        <div className="space-y-2">
          <p className="text-sm font-medium text-[color:var(--foreground-strong)]">{t("attachment")}</p>
          <button
            type="button"
            onClick={() => attachmentInputRef.current?.click()}
            className="flex w-full items-center justify-between gap-4 rounded-[1rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-start text-sm text-[color:var(--foreground-muted)]"
          >
            <span>{attachmentBusy ? t("uploading") : attachmentFileName || t("chooseFile")}</span>
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em]">{t("allowedTypes")}</span>
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
                    setAttachmentError(t("uploadError"));
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
            {common("cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || attachmentBusy}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {common("save")}
          </button>
        </div>
      </form>
    </DialogShell>
  );
}
