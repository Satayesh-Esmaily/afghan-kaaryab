"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppData } from "@/context/app-context";
import Footer from "@/components/layout/Footer";

type NavItem = {
  href: string;
  label: string;
};

const sidebarItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/opportunities", label: "Discover" },
  { href: "/saved", label: "Saved" },
  { href: "/add-opportunity", label: "Add Opportunity" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/settings", label: "Settings" },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Discover", subtitle: "Browse opportunities, save favorites, and keep track of deadlines." },
  "/dashboard": { title: "Dashboard", subtitle: "See the platform stats and recent submissions at a glance." },
  "/opportunities": { title: "Discover", subtitle: "Search, filter, and explore opportunities in one place." },
  "/saved": { title: "Saved", subtitle: "Return to the opportunities you bookmarked for later." },
  "/add-opportunity": { title: "Add Opportunity", subtitle: "Share a new listing with the community." },
  "/about": { title: "About", subtitle: "Learn what the platform solves and who it helps." },
  "/contact": { title: "Contact", subtitle: "Send suggestions or report an issue." },
  "/settings": { title: "Settings", subtitle: "Adjust your personal preferences and platform behavior." },
};

const pageTones: Record<string, { dot: string; title: string }> = {
  "/": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent-strong)]" },
  "/dashboard": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/opportunities": { dot: "bg-[color:var(--warning)]", title: "text-[color:var(--warning)]" },
  "/saved": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
  "/add-opportunity": { dot: "bg-[color:var(--accent)]", title: "text-[color:var(--accent)]" },
  "/about": { dot: "bg-[color:var(--success)]", title: "text-[color:var(--success)]" },
  "/contact": { dot: "bg-[color:var(--danger)]", title: "text-[color:var(--danger)]" },
  "/settings": { dot: "bg-[color:var(--accent-strong)]", title: "text-[color:var(--accent-strong)]" },
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
  const pageTone = pageTones[activePath ?? "/opportunities"] ?? pageTones["/opportunities"];

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[276px] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 lg:flex">
        <Link href="/" className="panel group rounded-[1.25rem] px-3.5 py-3.5 transition hover:-translate-y-0.5 hover:shadow-xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] accent-panel shadow-lg">
              <Image
                src="/Kaaryab%20assets/kaaryab-logo.png"
                alt="KaarYab Afghanistan logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <div className="min-w-0">
              <h2 className="whitespace-nowrap text-[0.98rem] font-semibold tracking-tight text-[color:var(--foreground)]">
                KaarYab Afghanistan
              </h2>
            </div>
          </div>
        </Link>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const active = isActiveLink(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group flex items-center rounded-[1rem] border px-3 py-2.75 transition",
                    active
                      ? "border-transparent active-pill"
                      : "border-transparent bg-transparent text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--foreground)]",
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1 pl-1">
                    <p className="truncate text-[14px] font-medium leading-5">{item.label}</p>
                  </div>

                  {item.href === "/saved" && savedCount > 0 ? (
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
                      ].join(" ")}
                    >
                      {savedCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>

      <div className="lg:pl-[276px]">
        <header className="sticky top-0 z-40 bg-[color:var(--background)]">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-sm">
              <span className={["h-2.5 w-2.5 rounded-full", pageTone.dot].join(" ")} />
              <h1
                className={[
                  "text-[1.05rem] font-semibold tracking-tight sm:text-[1.25rem]",
                  pageTone.title,
                ].join(" ")}
              >
                {page.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3.5 py-2 text-sm font-semibold text-[color:var(--foreground)] lg:hidden"
                aria-label="Open navigation"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3.5 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="mx-4 mt-3 panel rounded-[1.25rem] p-3.5 sm:mx-6 lg:hidden">
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const active = isActiveLink(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center rounded-[1rem] border px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "border-transparent active-pill"
                        : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]",
                    ].join(" ")}
                  >
                    <span className="flex-1 pl-1">{item.label}</span>
                    {item.href === "/saved" && savedCount > 0 ? (
                      <span className="rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--accent)]">
                        {savedCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
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

function isActiveLink(pathname: string | null, href: string) {
  if (!pathname) return false;

  return pathname === href || (href === "/opportunities" && pathname === "/") || pathname.startsWith(href);
}
