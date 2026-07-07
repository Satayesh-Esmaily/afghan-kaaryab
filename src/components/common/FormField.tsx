import type { ReactNode } from "react";

export default function FormField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className="text-sm font-semibold text-[color:var(--foreground-strong)]">{label}</span>
        {hint ? <span className="text-xs text-[color:var(--foreground-muted)]">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-2 text-sm text-[color:var(--danger)]">{error}</p> : null}
    </label>
  );
}
