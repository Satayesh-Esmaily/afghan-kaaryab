"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import FormField from "@/components/common/FormField";
import DatePickerField from "@/components/common/DatePickerField";
import SearchableSelect from "@/components/common/SearchableSelect";
import { opportunityFormSchema, type OpportunityFormValues } from "@/lib/schemas";
import {
  opportunityCategories,
  opportunityTypes,
  type Opportunity,
  type OpportunityInput,
} from "@/lib/opportunities";

type FormSubmitValue = OpportunityInput;

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function OpportunityForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: Opportunity | null;
  onSubmit: (values: FormSubmitValue) => void;
  submitLabel: string;
}) {
  const t = useTranslations("addOpportunity.form");
  const resolver: Resolver<OpportunityFormValues> =
    zodResolver(opportunityFormSchema) as Resolver<OpportunityFormValues>;

  const form = useForm<OpportunityFormValues>({
    resolver,
    defaultValues: {
      title: initialValues?.title ?? "",
      organization: initialValues?.organization ?? "",
      category: initialValues?.category ?? "Job",
      location: initialValues?.location ?? "",
      type: initialValues?.type ?? "Remote",
      deadline: initialValues?.deadline ?? "",
      description: initialValues?.description ?? "",
      requirementsText: initialValues?.requirements?.join("\n") ?? "",
      applyLink: initialValues?.applyLink ?? "",
      tagsText: initialValues?.tags?.join(", ") ?? "",
      featured: initialValues?.featured ?? false,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const categoryValue = useWatch({ control, name: "category" });
  const typeValue = useWatch({ control, name: "type" });
  const deadlineValue = useWatch({ control, name: "deadline" });
  const categoryOptions = {
    Job: t("categories.job"),
    Internship: t("categories.internship"),
    Scholarship: t("categories.scholarship"),
    "Online course": t("categories.onlineCourse"),
    "Remote work": t("categories.remoteWork"),
    "Training program": t("categories.trainingProgram"),
    "Volunteer work": t("categories.volunteerWork"),
  } as const;
  const typeOptions = {
    Remote: t("types.remote"),
    "On-site": t("types.onSite"),
    Hybrid: t("types.hybrid"),
    Online: t("types.online"),
  } as const;

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          title: values.title,
          organization: values.organization,
          category: values.category,
          location: values.location,
          type: values.type,
          deadline: values.deadline,
          description: values.description,
          requirements: splitList(values.requirementsText),
          applyLink: values.applyLink,
          tags: splitList(values.tagsText ?? ""),
          featured: values.featured,
        })
      )}
      className="ds-card rounded-[1.5rem] p-6 sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={t("title")} error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder={t("titlePlaceholder")} />
        </FormField>
        <FormField label={t("organization")} error={errors.organization?.message}>
          <input
            {...register("organization")}
            className="ds-input"
            placeholder={t("organizationPlaceholder")}
          />
        </FormField>
        <FormField label={t("category")} error={errors.category?.message}>
          <SearchableSelect
            value={categoryValue}
            options={opportunityCategories.map((category) => ({
              value: category,
              label: categoryOptions[category],
            }))}
            placeholder={t("selectCategory")}
            searchPlaceholder={t("searchCategory")}
            onChange={(value) =>
              setValue("category", value as OpportunityFormValues["category"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </FormField>
        <FormField label={t("opportunityType")} error={errors.type?.message}>
          <SearchableSelect
            value={typeValue}
            options={opportunityTypes.map((type) => ({ value: type, label: typeOptions[type] }))}
            placeholder={t("selectType")}
            searchPlaceholder={t("searchType")}
            onChange={(value) =>
              setValue("type", value as OpportunityFormValues["type"], {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </FormField>
        <FormField label={t("location")} error={errors.location?.message}>
          <input {...register("location")} className="ds-input" placeholder={t("locationPlaceholder")} />
        </FormField>
        <FormField label={t("deadline")} error={errors.deadline?.message}>
          <DatePickerField
            key={deadlineValue || "empty-deadline"}
            value={deadlineValue}
            placeholder={t("selectDate")}
            onChange={(value) =>
              setValue("deadline", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </FormField>
      </div>

      <div className="mt-5 grid gap-5">
        <FormField label={t("description")} error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="ds-input min-h-32"
            placeholder={t("descriptionPlaceholder")}
          />
        </FormField>
        <FormField
          label={t("requirements")}
          hint={t("requirementsHint")}
          error={errors.requirementsText?.message}
        >
          <textarea
            {...register("requirementsText")}
            className="ds-input min-h-28"
            placeholder={t("requirementsPlaceholder")}
          />
        </FormField>
        <FormField label={t("applyLink")} error={errors.applyLink?.message}>
          <input {...register("applyLink")} className="ds-input" placeholder={t("applyLinkPlaceholder")} />
        </FormField>
        <FormField label={t("tags")} hint={t("tagsHint")} error={errors.tagsText?.message}>
          <input {...register("tagsText")} className="ds-input" placeholder={t("tagsPlaceholder")} />
        </FormField>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
        <input
          type="checkbox"
          {...register("featured")}
          className="h-4 w-4 rounded border-[color:var(--border-strong)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
        />
        {t("featured")}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t("saving") : submitLabel}
      </button>
    </form>
  );
}
