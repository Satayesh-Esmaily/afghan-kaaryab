"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import FormField from "@/components/common/FormField";

export default function PasswordField({
  label,
  error,
  placeholder,
  autoComplete,
  registration,
}: {
  label: string;
  error?: string;
  placeholder: string;
  autoComplete: string;
  registration: UseFormRegisterReturn;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField label={label} error={error}>
      <div className="relative">
        <input
          {...registration}
          type={visible ? "text" : "password"}
          className="ds-input pr-12"
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground)]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </FormField>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        d="M3 12s3.5-6.25 9-6.25S21 12 21 12s-3.5 6.25-9 6.25S3 12 3 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19L19 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
