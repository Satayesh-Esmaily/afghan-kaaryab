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
import { loginFormSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAppData();
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "success"; title: string; message: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setNotice(null);

        try {
          await login(values);
          router.replace("/dashboard?status=welcome");
        } catch (error) {
          setNotice({
            tone: "error",
            title: authCopy.loginErrorFallback,
            message: error instanceof Error ? error.message : authCopy.authErrorFallback,
          });
        }
      })}
      className="space-y-5"
    >
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
        autoComplete="current-password"
        registration={register("password")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {authCopy.loginSubmitLabel}
      </button>

      {notice ? <AuthNotice tone={notice.tone} title={notice.title} message={notice.message} /> : null}
    </form>
  );
}
