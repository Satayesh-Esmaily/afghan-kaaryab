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
    default:
      "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200 border-slate-200 dark:border-white/10",
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
    info: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
    accent: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/20",
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
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
    default: "from-slate-100 to-white dark:from-white/5 dark:to-white/[0.03]",
    info: "from-sky-100 to-white dark:from-sky-500/10 dark:to-white/[0.03]",
    success: "from-emerald-100 to-white dark:from-emerald-500/10 dark:to-white/[0.03]",
    accent: "from-fuchsia-100 to-white dark:from-fuchsia-500/10 dark:to-white/[0.03]",
  };

  return (
    <div className={`rounded-3xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm dark:border-white/10 ${accents[tone]}`}>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
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
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm dark:border-white/15 dark:bg-white/[0.03]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-white/10">
        !
      </div>
      <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl dark:bg-slate-950">
        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-semibold text-white transition",
              danger ? "bg-rose-600 hover:bg-rose-500" : "bg-slate-950 hover:bg-slate-800",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
