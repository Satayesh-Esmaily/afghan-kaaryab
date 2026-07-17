"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import PasswordField from "@/components/common/PasswordField";
import AuthNotice from "@/components/auth/AuthNotice";
import { authCopy } from "@/config/auth";
import { useAppData } from "@/context/app-context";
import { signupFormSchema, type SignupFormValues } from "@/lib/schemas";

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAppData();
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "success"; title: string; message: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setNotice(null);

        try {
          const result = await signup(values);

          if (result.needsConfirmation) {
            setNotice({
              tone: "info",
              title: authCopy.signupPendingTitle,
              message: authCopy.signupPendingMessage,
            });
            return;
          }

          router.replace("/profile?status=welcome");
        } catch (error) {
          setNotice({
            tone: "error",
            title: authCopy.signupErrorFallback,
            message: error instanceof Error ? error.message : authCopy.authErrorFallback,
          });
        }
      })}
      className="space-y-5"
    >
      <FormField label={authCopy.fullNameLabel} error={errors.fullName?.message}>
        <input
          {...register("fullName")}
          className="ds-input"
          placeholder={authCopy.fullNamePlaceholder}
          autoComplete="name"
        />
      </FormField>

      <FormField label={authCopy.emailLabel} error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className="ds-input"
          placeholder={authCopy.emailPlaceholder}
          autoComplete="email"
        />
      </FormField>

      <PasswordField
        label={authCopy.passwordLabel}
        error={errors.password?.message}
        placeholder={authCopy.passwordPlaceholder}
        autoComplete="new-password"
        registration={register("password")}
      />

      <PasswordField
        label={authCopy.confirmPasswordLabel}
        error={errors.confirmPassword?.message}
        placeholder={authCopy.confirmPasswordPlaceholder}
        autoComplete="new-password"
        registration={register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {authCopy.signupSubmitLabel}
      </button>

      {notice ? <AuthNotice tone={notice.tone} title={notice.title} message={notice.message} /> : null}
    </form>
  );
}
