"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import SearchableSelect from "@/components/common/SearchableSelect";
import { experienceEntrySchema, type ExperienceEntryFormValues } from "@/lib/schemas";
import { DialogShell, employmentTypes, getDefaultExperienceEntry } from "@/components/profile/dialogs/shared";

type ExperienceDialogProps = {
  open: boolean;
  initialValues: ExperienceEntryFormValues | null;
  onClose: () => void;
  onSave: (values: ExperienceEntryFormValues) => void;
};

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
            <SearchableSelect
              value={watch("employmentType")}
              options={employmentTypes.map((type) => ({ value: type, label: type }))}
              placeholder="Select type"
              searchPlaceholder="Search type..."
              onChange={(value) => {
                setValue("employmentType", value, { shouldDirty: true, shouldValidate: true });
              }}
            />
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
