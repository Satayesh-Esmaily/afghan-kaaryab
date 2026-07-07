"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async () => {
        setSubmitted(true);
        reset();
      })}
      className="ds-card rounded-[1.5rem] p-6 sm:p-8"
    >
      <div className="mb-6 rounded-[1.25rem] border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)]/60 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
          Demo form
        </p>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
          Messages stay local in this version so you can test it safely.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Name" error={errors.name?.message}>
          <input {...register("name")} className="ds-input" placeholder="Your name" />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="ds-input" placeholder="you@example.com" />
        </FormField>
      </div>

      <div className="mt-5 grid gap-5">
        <FormField label="Subject" error={errors.subject?.message}>
          <input {...register("subject")} className="ds-input" placeholder="Opportunity suggestion" />
        </FormField>
        <FormField label="Message" error={errors.message?.message}>
          <textarea {...register("message")} className="ds-input min-h-40" placeholder="Tell us what should be added or improved." />
        </FormField>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-2xl border border-[color:var(--success-soft)] bg-[color:var(--success-soft)] px-4 py-3 text-sm font-medium text-[color:var(--success)]">
          Thanks. Your message has been captured for the demo version of the project.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
      Send message
      </button>
    </form>
  );
}
