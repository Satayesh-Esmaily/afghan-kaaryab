"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import { opportunityFormSchema, type OpportunityFormValues } from "@/lib/schemas";
import {
  opportunityCategories,
  opportunityTypes,
  type Opportunity,
  type OpportunityInput,
} from "@/lib/opportunities";
import { opportunityFormCopy } from "@/config/opportunities";

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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    reset({
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
    });
  }, [initialValues, reset]);

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
        <FormField label="Title" error={errors.title?.message}>
          <input {...register("title")} className="ds-input" placeholder={opportunityFormCopy.titlePlaceholder} />
        </FormField>
        <FormField label="Organization" error={errors.organization?.message}>
          <input
            {...register("organization")}
            className="ds-input"
            placeholder={opportunityFormCopy.organizationPlaceholder}
          />
        </FormField>
        <FormField label="Category" error={errors.category?.message}>
          <select {...register("category")} className="ds-input">
            {opportunityCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Opportunity type" error={errors.type?.message}>
          <select {...register("type")} className="ds-input">
            {opportunityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Location" error={errors.location?.message}>
          <input {...register("location")} className="ds-input" placeholder={opportunityFormCopy.locationPlaceholder} />
        </FormField>
        <FormField label="Deadline" error={errors.deadline?.message}>
          <input {...register("deadline")} type="date" className="ds-input" />
        </FormField>
      </div>

      <div className="mt-5 grid gap-5">
        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="ds-input min-h-32"
            placeholder={opportunityFormCopy.descriptionPlaceholder}
          />
        </FormField>
        <FormField
          label="Requirements"
          hint={opportunityFormCopy.requirementsHint}
          error={errors.requirementsText?.message}
        >
          <textarea
            {...register("requirementsText")}
            className="ds-input min-h-28"
            placeholder={opportunityFormCopy.requirementsPlaceholder}
          />
        </FormField>
        <FormField label="Apply link" error={errors.applyLink?.message}>
          <input
            {...register("applyLink")}
            className="ds-input"
            placeholder={opportunityFormCopy.applyLinkPlaceholder}
          />
        </FormField>
        <FormField label="Tags" hint={opportunityFormCopy.tagsHint} error={errors.tagsText?.message}>
          <input {...register("tagsText")} className="ds-input" placeholder={opportunityFormCopy.tagsPlaceholder} />
        </FormField>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
        <input
          type="checkbox"
          {...register("featured")}
          className="h-4 w-4 rounded border-[color:var(--border-strong)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
        />
        {opportunityFormCopy.featuredLabel}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? opportunityFormCopy.savingLabel : submitLabel}
      </button>
    </form>
  );
}
