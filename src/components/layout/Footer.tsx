import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const footerLinks = [
  { href: "/opportunities", labelKey: "links.browse" },
  { href: "/add-opportunity", labelKey: "links.submit" },
  { href: "/dashboard", labelKey: "links.dashboard" },
  { href: "/contact", labelKey: "links.contact" },
] as const;

export default async function Footer() {
  const tFooter = await getTranslations("footer");

  return (
    <footer className="border-t border-[color:var(--border)]/80 bg-[color:var(--surface)]/80 backdrop-blur">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="ds-title text-lg font-semibold">KaarYab Afghanistan</p>
          <p className="ds-muted max-w-md text-sm leading-6">{tFooter("brandDescription")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm font-medium text-[color:var(--foreground)]">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 transition hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--foreground-strong)]"
            >
              {tFooter(link.labelKey)}
            </Link>
          ))}
        </div>

        <div className="space-y-2 text-sm text-[color:var(--foreground)]">
          <p className="ds-title font-semibold">{tFooter("focusTitle")}</p>
          <p>{tFooter("focusBody")}</p>
          <p>
            © {new Date().getFullYear()} {tFooter("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
