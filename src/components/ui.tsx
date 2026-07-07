import Link from "next/link";

type BadgeTone = "default" | "success" | "warning" | "info" | "accent";

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const tones: Record<BadgeTone, string> = {
    default: "bg-[color:var(--surface-soft)] text-[color:var(--foreground)] border-[color:var(--border)]",
    success:
      "bg-[color:var(--success-soft)] text-[#258d3f] border-transparent dark:text-[color:var(--success)]",
    warning:
      "bg-[color:var(--warning-soft)] text-[#8c7000] border-transparent dark:text-[color:var(--warning)]",
    info: "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] border-transparent",
    accent: "bg-[color:var(--accent)] text-white border-transparent",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="ds-kicker mb-3 text-sm font-semibold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="ds-title text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="ds-muted mt-4 text-base leading-7">{description}</p>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "info" | "success" | "accent";
}) {
  const accents: Record<"default" | "info" | "success" | "accent", string> = {
    default: "from-[color:var(--surface-soft)] to-[color:var(--surface)]",
    info: "from-[color:var(--accent-soft)] to-[color:var(--surface)]",
    success: "from-[color:var(--success-soft)] to-[color:var(--surface)]",
    accent: "from-[color:var(--accent-soft)] to-[color:var(--surface)]",
  };

  return (
    <div className={`ds-card rounded-2xl bg-gradient-to-br p-5 ${accents[tone]}`}>
      <p className="ds-muted text-sm font-medium">{label}</p>
      <p className="ds-title mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </p>
      {hint ? <p className="ds-muted mt-2 text-sm">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  }) {
  return (
    <div className="ds-card rounded-[1.5rem] border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)]/70 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-2xl text-[color:var(--accent-strong)]">
        !
      </div>
      <h3 className="ds-title text-xl font-semibold">{title}</h3>
      <p className="ds-muted mx-auto mt-3 max-w-xl text-sm leading-6">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="ds-button-primary mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="ds-card w-full max-w-lg rounded-[1.5rem] bg-[color:var(--surface)] p-6">
        <h3 className="ds-title text-xl font-semibold">{title}</h3>
        <p className="ds-muted mt-3 text-sm leading-6">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="ds-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-semibold text-white transition",
              danger ? "ds-danger" : "ds-button-primary",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
