import Link from "next/link";

const footerLinks = [
  { href: "/opportunities", label: "Browse" },
  { href: "/add-opportunity", label: "Submit" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">KaarYab Afghanistan</p>
          <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A modern opportunity finder for Afghan youth, built for jobs, internships,
            scholarships, remote work, and skill-building opportunities.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-950 dark:text-white">Demo Data</p>
          <p>
            This project uses sample opportunities so the platform is safe to preview,
            submit to, and present during your final demo.
          </p>
          <p>(c) {new Date().getFullYear()} KaarYab Afghanistan</p>
        </div>
      </div>
    </footer>
  );
}
