"use client";

type ProfileViewHeaderProps = {
  showWelcome: boolean;
  signupSuccessTitle: string;
  signupSuccessMessage: string;
  title: string;
};

export function ProfileViewHeader({
  showWelcome,
  signupSuccessTitle,
  signupSuccessMessage,
  title,
}: ProfileViewHeaderProps) {
  return (
    <>
      {showWelcome ? (
        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-sm sm:px-6">
          <p className="text-sm font-semibold text-[color:var(--foreground-strong)]">{signupSuccessTitle}</p>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{signupSuccessMessage}</p>
        </div>
      ) : null}

      <div className="rounded-[1.5rem] panel px-5 py-4 text-lg font-semibold text-[color:var(--foreground)] sm:px-6">
        {title}
      </div>
    </>
  );
}
