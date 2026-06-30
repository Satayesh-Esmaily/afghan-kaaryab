"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-rose-500/20 dark:bg-white/[0.04]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-600 dark:text-rose-300">
        Something went wrong
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
        We could not load this page
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
      >
        Try again
      </button>
    </div>
  );
}
