export type NavItem = {
  href: string;
  label: string;
};

export const sidebarItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/opportunities", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/add-opportunity", label: "Add Opportunity" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/settings", label: "Settings" },
];

export const pageHeaders: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Discover", subtitle: "Browse opportunities, save favorites, and keep track of deadlines." },
  "/dashboard": { title: "Dashboard", subtitle: "See the platform stats and recent submissions at a glance." },
  "/opportunities": { title: "Discover", subtitle: "Search, filter, and explore opportunities in one place." },
  "/saved": { title: "Saved", subtitle: "Return to the opportunities you bookmarked for later." },
  "/add-opportunity": { title: "Add Opportunity", subtitle: "Share a new listing with the community." },
  "/about": { title: "About", subtitle: "Learn what the platform solves and who it helps." },
  "/contact": { title: "Contact", subtitle: "Send suggestions or report an issue." },
  "/settings": { title: "Settings", subtitle: "Adjust your personal preferences and platform behavior." },
};

export const pageTones: Record<string, { dot: string; title: string }> = {
  "/": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent-strong)]" },
  "/dashboard": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/opportunities": { dot: "bg-[color:var(--warning)]", title: "text-[color:var(--warning)]" },
  "/saved": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
  "/add-opportunity": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent)]" },
  "/about": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/contact": { dot: "bg-[color:var(--danger)]", title: "text-[color:var(--danger)]" },
  "/settings": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
};

export const brand = {
  name: "KaarYab Afghanistan",
  logoAlt: "KaarYab Afghanistan logo",
  logoSrc: "/logos/kaaryab-logo.png",
};
