type AuthNoticeTone = "info" | "success" | "error";

export default function AuthNotice({
  tone,
  title,
  message,
}: {
  tone: AuthNoticeTone;
  title: string;
  message: string;
}) {
  const styles: Record<AuthNoticeTone, string> = {
    info: "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)] text-[color:var(--foreground-strong)]",
    success: "border-[color:var(--success-soft)] bg-[color:var(--success-soft)] text-[color:var(--foreground-strong)]",
    error: "border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] text-[color:var(--foreground-strong)]",
  };

  const dotStyles: Record<AuthNoticeTone, string> = {
    info: "bg-[color:var(--accent)]",
    success: "bg-[color:var(--success)]",
    error: "bg-[color:var(--danger)]",
  };

  return (
    <div className={["rounded-[1.25rem] border px-4 py-3.5", styles[tone]].join(" ")}>
      <div className="flex items-start gap-3">
        <span className={["mt-1 h-2.5 w-2.5 shrink-0 rounded-full", dotStyles[tone]].join(" ")} />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-6">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--foreground-muted)]">{message}</p>
        </div>
      </div>
    </div>
  );
}
