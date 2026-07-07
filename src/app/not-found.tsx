import Link from "next/link";

export default function NotFound() {
  return (
    <div className="ds-card mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center rounded-[1.5rem] p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
        404
      </p>
      <h1 className="ds-title mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="ds-muted mt-3 max-w-xl text-sm leading-6">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="ds-button-primary mt-6 rounded-full px-5 py-3 text-sm font-semibold transition"
      >
        Return home
      </Link>
    </div>
  );
}
