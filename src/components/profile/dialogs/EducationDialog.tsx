"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import DatePickerField from "@/components/common/DatePickerField";
import FormField from "@/components/common/FormField";
import { useWatch } from "react-hook-form";
import { educationEntrySchema, type EducationEntryFormValues } from "@/lib/schemas";
import { DialogShell, getDefaultEducationEntry } from "@/components/profile/dialogs/shared";

type EducationDialogProps = {
  open: boolean;
  initialValues: EducationEntryFormValues | null;
  onClose: () => void;
  onSave: (values: EducationEntryFormValues) => void;
};

export function EducationEntryDialog({ open, initialValues, onClose, onSave }: EducationDialogProps) {
  const t = useTranslations("profile.dialogs.education");
  const common = useTranslations("common");
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EducationEntryFormValues>({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: initialValues ?? getDefaultEducationEntry(),
  });

  const startDateValue = useWatch({ control, name: "startDate" });
  const endDateValue = useWatch({ control, name: "endDate" });

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
        <FormField label={t("degree")} error={errors.degree?.message}>
          <input {...register("degree")} className="ds-input" placeholder={t("degreePlaceholder")} />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label={t("institution")} error={errors.institution?.message}>
            <input {...register("institution")} className="ds-input" placeholder={t("institutionPlaceholder")} />
          </FormField>
          <FormField label={t("fieldOfStudy")} error={errors.fieldOfStudy?.message}>
            <input {...register("fieldOfStudy")} className="ds-input" placeholder={t("fieldOfStudyPlaceholder")} />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label={t("country")} error={errors.country?.message}>
            <input {...register("country")} className="ds-input" placeholder={t("countryPlaceholder")} />
          </FormField>
          <FormField label={t("province")} error={errors.province?.message}>
            <input {...register("province")} className="ds-input" placeholder={t("provincePlaceholder")} />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label={t("startDate")} error={errors.startDate?.message}>
            <DatePickerField
              value={startDateValue}
              onChange={(value) => setValue("startDate", value, { shouldDirty: true, shouldValidate: true })}
              placeholder={t("selectDate")}
            />
          </FormField>
          <FormField label={t("endDate")} error={errors.endDate?.message}>
            <DatePickerField
              value={endDateValue}
              onChange={(value) => setValue("endDate", value, { shouldDirty: true, shouldValidate: true })}
              placeholder={t("selectDate")}
            />
          </FormField>
        </div>

        <FormField label={t("description")} error={errors.description?.message} hint={t("optional")}>
          <textarea {...register("description")} className="ds-input min-h-36" placeholder={t("descriptionPlaceholder")} />
        </FormField>

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
            disabled={isSubmitting}
            className="ds-button-primary rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {common("save")}
          </button>
        </div>
      </form>
    </DialogShell>
  );
}
