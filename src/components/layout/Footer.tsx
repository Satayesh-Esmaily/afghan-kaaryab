import Link from "next/link";

const footerLinks = [
  { href: "/opportunities", label: "Browse" },
  { href: "/add-opportunity", label: "Submit" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)]/80 bg-[color:var(--surface)]/80 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="ds-title text-lg font-semibold">KaarYab Afghanistan</p>
          <p className="ds-muted max-w-md text-sm leading-6">
            A modern opportunity finder for Afghan job seekers, built for jobs, internships,
            scholarships, remote work, and skill-building opportunities.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm font-medium text-[color:var(--foreground)]">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 transition hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--foreground-strong)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="space-y-2 text-sm text-[color:var(--foreground)]">
          <p className="ds-title font-semibold">Platform focus</p>
          <p>Built to help Afghan communities discover and share trusted opportunities.</p>
          <p>© {new Date().getFullYear()} KaarYab Afghanistan</p>
        </div>
      </div>
    </footer>
  );
}
