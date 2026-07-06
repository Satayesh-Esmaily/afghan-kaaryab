"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input {...register("name")} className="form-input" placeholder="Your name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="form-input" placeholder="you@example.com" />
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field label="Subject" error={errors.subject?.message}>
          <input {...register("subject")} className="form-input" placeholder="Opportunity suggestion" />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <textarea {...register("message")} className="form-input min-h-40" placeholder="Tell us what should be added or improved." />
        </Field>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          Thanks. Your message has been captured for the demo version of the project.
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Send message
      </button>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0.875rem 1rem;
          font-size: 0.95rem;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .dark .form-input {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: rgb(248 250 252);
        }

        .form-input:focus {
          border-color: rgb(34 211 238);
          box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.18);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  );
}
