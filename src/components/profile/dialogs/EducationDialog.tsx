"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import { educationEntrySchema, type EducationEntryFormValues } from "@/lib/schemas";
import { DialogShell, getDefaultEducationEntry } from "@/components/profile/dialogs/shared";

type EducationDialogProps = {
  open: boolean;
  initialValues: EducationEntryFormValues | null;
  onClose: () => void;
  onSave: (values: EducationEntryFormValues) => void;
};

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
