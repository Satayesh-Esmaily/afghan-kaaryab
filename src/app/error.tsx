"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="ds-card mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center rounded-[1.5rem] p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--danger)]">
        Something went wrong
      </p>
      <h1 className="ds-title mt-4 text-3xl font-semibold">
        We could not load this page
      </h1>
      <p className="ds-muted mt-3 max-w-xl text-sm leading-6">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="ds-button-primary mt-6 rounded-full px-5 py-3 text-sm font-semibold transition"
      >
        Try again
      </button>
    </div>
  );
}
