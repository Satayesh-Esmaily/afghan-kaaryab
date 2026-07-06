"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactElement } from "react";
import { useAppData } from "@/context/app-context";
import Footer from "@/components/layout/Footer";

type NavIconProps = {
  className?: string;
};

type NavIcon = (props: NavIconProps) => ReactElement;

type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
};

type SidebarGroup = {
  label: string;
  items: NavItem[];
};

const sidebarGroups: SidebarGroup[] = [
  {
    label: "General",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { href: "/opportunities", label: "Discover", icon: CompassIcon },
      { href: "/saved", label: "Saved", icon: BookmarkIcon },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/add-opportunity", label: "Add Opportunity", icon: PlusIcon },
      { href: "/about", label: "About", icon: InfoIcon },
      { href: "/contact", label: "Contact", icon: MessageIcon },
    ],
  },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Discover",
    subtitle: "Browse opportunities, save favorites, and keep track of deadlines.",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "See the platform stats and recent submissions at a glance.",
  },
  "/opportunities": {
    title: "Discover",
    subtitle: "Search, filter, and explore opportunities in one place.",
  },
  "/saved": {
    title: "Saved",
    subtitle: "Return to the opportunities you bookmarked for later.",
  },
  "/add-opportunity": {
    title: "Add Opportunity",
    subtitle: "Share a new listing with the community.",
  },
  "/about": {
    title: "About",
    subtitle: "Learn what the platform solves and who it helps.",
  },
  "/contact": {
    title: "Contact",
    subtitle: "Send suggestions or report an issue.",
  },
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { savedIds, theme, setTheme } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedCount = savedIds.length;

  const activePath = Object.keys(pageTitles).find((path) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path)
  );
  const page = pageTitles[activePath ?? "/opportunities"];

  const items = sidebarGroups.flatMap((group) => group.items);

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[280px] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-6 backdrop-blur-xl lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-panel shadow-lg">
            <BookIcon />
          </span>
          <span className="text-[28px] font-semibold tracking-tight text-[color:var(--foreground)]">
            KaarYab.
          </span>
        </Link>

        <div className="mt-10 space-y-8 overflow-y-auto pr-1">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href === "/opportunities" && pathname === "/") ||
                    pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition",
                        active ? "active-pill" : "inactive-pill hover:bg-slate-100 dark:hover:bg-white/5",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-[1.75rem] accent-panel p-5 shadow-xl">
          <p className="text-lg font-semibold leading-6">
            24/7 Access to Your Personal Opportunity Board
          </p>
          <div className="mt-4 flex text-2xl tracking-[0.15em] text-white/90">★★★★★</div>
          <p className="mt-3 text-sm text-white/80">Saved items: {savedCount}</p>
          <p className="mt-4 text-sm leading-6 text-white/90">
            Demo listings, saved items, and quick actions ready for presentation.
          </p>
          <Link
            href="/add-opportunity"
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
          >
            Post a listing
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-40 border-b border-transparent bg-[color:var(--background)]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="panel rounded-[1.5rem] px-5 py-4">
              <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {page.title}
              </h1>
              <p className="mt-1 text-sm text-[color:var(--muted)]">{page.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="chrome-icon-btn lg:hidden"
                aria-label="Open navigation"
              >
                <MenuIcon />
              </button>
              <button className="chrome-icon-btn" aria-label="Search">
                <SearchIcon />
              </button>
              <button className="chrome-icon-btn" aria-label="Cart">
                <CartIcon />
              </button>
              <button className="chrome-icon-btn" aria-label="Notifications">
                <BellIcon />
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="chrome-avatar-btn"
                aria-label="Toggle theme"
              >
                <AvatarIcon />
              </button>
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="mx-4 mt-3 panel rounded-[1.75rem] p-4 sm:mx-6 lg:hidden">
            <div className="grid gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href === "/opportunities" && pathname === "/") ||
                  pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                      active ? "active-pill" : "inactive-pill hover:bg-slate-100 dark:hover:bg-white/5",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

function BookIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 4.75A2.75 2.75 0 0 1 8.75 2h8.5A2.75 2.75 0 0 1 20 4.75v14.5A2.75 2.75 0 0 1 17.25 22h-8.5A2.75 2.75 0 0 1 6 19.25V4.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8.5 7h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 11h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 7h15l-1.5 7.5H8L6 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 19.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM17 19.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" fill="currentColor" />
      <path d="M6 7 5 4H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 17H9m8-4V9a5 5 0 1 0-10 0v4l-2 2h14l-2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AvatarIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#ffe3bf" />
      <circle cx="24" cy="18" r="8" fill="#7d4c2e" />
      <path d="M11 38c2.5-7.2 9.1-12 13-12s10.5 4.8 13 12" fill="#7d4c2e" />
      <path d="M15 14c2.2-3 5.6-4.5 9-4.5s6.8 1.5 9 4.5" fill="#2d1f16" />
      <path d="M32 18h5v7h-5z" fill="#2d1f16" />
      <path d="M17 19h4m6 0h4" stroke="#2d1f16" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M18.5 24c1.5 2 3.1 3 5.5 3s4-1 5.5-3" stroke="#2d1f16" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9 4h7v3h-7v-3Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CompassIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.8 9.2 10.2 10.7 9.2 14.8 13.8 13.3 14.8 9.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v13L12 15l-6.5 4V6A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7.6h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.5 5.5h15v10h-8l-4.5 3v-3h-2.5v-10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
