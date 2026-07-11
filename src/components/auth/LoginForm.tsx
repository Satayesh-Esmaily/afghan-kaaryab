"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/common/FormField";
import { authCopy } from "@/config/auth";
import { useAppData } from "@/context/app-context";
import { loginFormSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAppData();
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
        login(values);
        router.replace("/dashboard");
      })}
      className="ds-card rounded-[1.75rem] p-6 sm:p-8"
    >
      <div className="mb-6 rounded-[1.25rem] border border-[color:var(--accent-soft)] bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-soft))] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
          {authCopy.loginBadge}
        </p>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{authCopy.loginBody}</p>
      </div>

      <div className="space-y-5">
        <FormField label={authCopy.emailLabel} error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className="ds-input"
            placeholder={authCopy.emailPlaceholder}
            autoComplete="email"
          />
        </FormField>
        <FormField label={authCopy.passwordLabel} error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            className="ds-input"
            placeholder={authCopy.passwordPlaceholder}
            autoComplete="current-password"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="ds-button-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {authCopy.submitLabel}
      </button>
    </form>
  );
}
