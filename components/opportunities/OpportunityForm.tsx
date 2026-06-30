"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" error={errors.title?.message}>
          <input {...register("title")} className="input-field" placeholder="Frontend Developer Intern" />
        </Field>
        <Field label="Organization" error={errors.organization?.message}>
          <input {...register("organization")} className="input-field" placeholder="Kabul Tech Community" />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <select {...register("category")} className="input-field">
            {opportunityCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Opportunity type" error={errors.type?.message}>
          <select {...register("type")} className="input-field">
            {opportunityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <input {...register("location")} className="input-field" placeholder="Kabul" />
        </Field>
        <Field label="Deadline" error={errors.deadline?.message}>
          <input {...register("deadline")} type="date" className="input-field" />
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="input-field min-h-32"
            placeholder="Describe the opportunity, audience, and main value."
          />
        </Field>
        <Field
          label="Requirements"
          hint="Use one requirement per line or separate them with commas."
          error={errors.requirementsText?.message}
        >
          <textarea
            {...register("requirementsText")}
            className="input-field min-h-28"
            placeholder="Basic React
HTML/CSS
GitHub"
          />
        </Field>
        <Field label="Apply link" error={errors.applyLink?.message}>
          <input {...register("applyLink")} className="input-field" placeholder="https://example.com/apply" />
        </Field>
        <Field label="Tags" hint="Comma separated, like React, Remote, Internship." error={errors.tagsText?.message}>
          <input {...register("tagsText")} className="input-field" placeholder="React, Remote, Internship" />
        </Field>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <input
          type="checkbox"
          {...register("featured")}
          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
        />
        Mark as featured
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[linear-gradient(135deg,#e2e8f0,#ffffff)] dark:text-slate-950"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
        }

        .dark .input-field {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: rgb(248 250 252);
        }

        .input-field:focus {
          border-color: rgb(34 211 238);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.18);
          background: white;
        }

        .dark .input-field:focus {
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
        {hint ? <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  );
}
