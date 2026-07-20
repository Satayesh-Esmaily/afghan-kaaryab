"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import FormField from "@/components/common/FormField";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [submitMessage, setSubmitMessage] = useState("");
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
      onSubmit={handleSubmit(async (values) => {
        setSubmitMessage("");

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = (await response.json().catch(() => null)) as
          | { ok?: boolean; message?: string }
          | null;

        if (!response.ok || !result?.ok) {
          setSubmitMessage(result?.message ?? t("errorFallback"));
          return;
        }

        setSubmitMessage(result.message ?? t("successMessage"));
        reset();
      })}
      className="ds-card rounded-[1.5rem] p-6 sm:p-8"
    >
      <div className="mb-6 rounded-[1.25rem] border border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)]/60 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
          {t("formBadge")}
        </p>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{t("formBody")}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={t("fields.name")} error={errors.name?.message}>
          <input {...register("name")} className="ds-input" placeholder={t("placeholders.name")} />
        </FormField>
        <FormField label={t("fields.email")} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className="ds-input"
            placeholder={t("placeholders.email")}
          />
        </FormField>
      </div>

      <div className="mt-5 grid gap-5">
        <FormField label={t("fields.subject")} error={errors.subject?.message}>
          <input {...register("subject")} className="ds-input" placeholder={t("placeholders.subject")} />
        </FormField>
        <FormField label={t("fields.message")} error={errors.message?.message}>
          <textarea
            {...register("message")}
            className="ds-input min-h-40"
            placeholder={t("placeholders.message")}
          />
        </FormField>
      </div>

      {submitMessage ? (
        <div className="mt-5 rounded-2xl border border-[color:var(--success-soft)] bg-[color:var(--success-soft)] px-4 py-3 text-sm font-medium text-[color:var(--success)]">
          {submitMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? t("sending") : t("submitLabel")}
      </button>
    </form>
  );
}
