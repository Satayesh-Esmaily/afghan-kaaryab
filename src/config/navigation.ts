export type ShellPath =
  | "/"
  | "/dashboard"
  | "/profile"
  | "/resume-builder"
  | "/opportunities"
  | "/organizations"
  | "/saved"
  | "/add-opportunity"
  | "/about"
  | "/contact"
  | "/settings";

export type NavItem = {
  href: ShellPath;
  labelKey: string;
  authOnly?: boolean;
};

export type PageHeader = {
  titleKey: string;
  subtitleKey: string;
};

export const sidebarItems: NavItem[] = [
  { href: "/dashboard", labelKey: "sidebar.dashboard" },
  { href: "/profile", labelKey: "sidebar.profile", authOnly: true },
  { href: "/resume-builder", labelKey: "sidebar.resumeBuilder", authOnly: true },
  { href: "/opportunities", labelKey: "sidebar.discover" },
  { href: "/organizations", labelKey: "sidebar.directory" },
  { href: "/saved", labelKey: "sidebar.saved" },
  { href: "/add-opportunity", labelKey: "sidebar.addOpportunity" },
  { href: "/about", labelKey: "sidebar.about" },
  { href: "/contact", labelKey: "sidebar.contact" },
  { href: "/settings", labelKey: "sidebar.settings" },
];

export const pageHeaderOrder: ShellPath[] = [
  "/",
  "/dashboard",
  "/profile",
  "/resume-builder",
  "/opportunities",
  "/organizations",
  "/saved",
  "/add-opportunity",
  "/about",
  "/contact",
  "/settings",
];

export const pageHeaders: Record<ShellPath, PageHeader> = {
  "/": { titleKey: "pages.home.title", subtitleKey: "pages.home.subtitle" },
  "/dashboard": { titleKey: "pages.dashboard.title", subtitleKey: "pages.dashboard.subtitle" },
  "/profile": { titleKey: "pages.profile.title", subtitleKey: "pages.profile.subtitle" },
  "/resume-builder": { titleKey: "pages.resumeBuilder.title", subtitleKey: "pages.resumeBuilder.subtitle" },
  "/opportunities": { titleKey: "pages.discover.title", subtitleKey: "pages.discover.subtitle" },
  "/organizations": { titleKey: "pages.directory.title", subtitleKey: "pages.directory.subtitle" },
  "/saved": { titleKey: "pages.saved.title", subtitleKey: "pages.saved.subtitle" },
  "/add-opportunity": { titleKey: "pages.addOpportunity.title", subtitleKey: "pages.addOpportunity.subtitle" },
  "/about": { titleKey: "pages.about.title", subtitleKey: "pages.about.subtitle" },
  "/contact": { titleKey: "pages.contact.title", subtitleKey: "pages.contact.subtitle" },
  "/settings": { titleKey: "pages.settings.title", subtitleKey: "pages.settings.subtitle" },
};

export const pageTones: Record<ShellPath, { dot: string; title: string }> = {
  "/": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent-strong)]" },
  "/dashboard": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/profile": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent)]" },
  "/resume-builder": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/opportunities": { dot: "bg-[color:var(--warning)]", title: "text-[color:var(--warning)]" },
  "/organizations": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent)]" },
  "/saved": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
  "/add-opportunity": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent)]" },
  "/about": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/contact": { dot: "bg-[color:var(--danger)]", title: "text-[color:var(--danger)]" },
  "/settings": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
};

export function isShellLinkActive(pathname: string | null, href: ShellPath) {
  if (!pathname) return false;

  return pathname === href || (href === "/opportunities" && pathname === "/") || pathname.startsWith(href);
}

export const brand = {
  name: "KaarYab Afghanistan",
  logoAlt: "KaarYab Afghanistan logo",
  logoSrc: "/logos/kaaryab-logo.png",
};
