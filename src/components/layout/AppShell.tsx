"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAppData } from "@/context/app-context";
import { authCopy } from "@/config/auth";
import Footer from "@/components/layout/Footer";
import { brand, pageHeaders, pageTones, sidebarItems } from "@/config/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedIds, theme, setTheme, user, authenticated, logout } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedCount = savedIds.length;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const activePath = Object.keys(pageHeaders).find((path) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path)
  );
  const page = pageHeaders[activePath ?? "/opportunities"];
  const pageTone = pageTones[activePath ?? "/opportunities"] ?? pageTones["/opportunities"];

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[276px] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 lg:flex">
        <Link href="/" className="panel group rounded-[1.25rem] px-3.5 py-3.5 transition hover:-translate-y-0.5 hover:shadow-xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
              <Image
                src={brand.logoSrc}
                alt={brand.logoAlt}
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <div className="min-w-0">
              <h2 className="whitespace-nowrap text-[0.98rem] font-semibold tracking-tight text-[color:var(--foreground)]">
                {brand.name}
              </h2>
            </div>
          </div>
        </Link>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              if (item.authOnly && !authenticated) {
                return null;
              }

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

        <div className="mt-4 space-y-3 border-t border-[color:var(--border)] pt-4">
          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              Signed in as
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-[color:var(--foreground-strong)]">
              {user?.displayName ?? authCopy.guestLabel}
            </p>
            <p className="truncate text-xs text-[color:var(--foreground-muted)]">{user?.email ?? ""}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
            }}
            className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-left text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
          >
            {authCopy.signOutLabel}
          </button>
        </div>

      </aside>

      <div className="lg:pl-[276px]">
        <header className="sticky top-0 z-40 bg-[color:var(--background)]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-sm sm:max-w-[min(100%,22rem)]">
              <span className={["h-2.5 w-2.5 rounded-full", pageTone.dot].join(" ")} />
              <div className="min-w-0">
                <h1
                  className={[
                    "truncate text-[1rem] font-semibold tracking-tight sm:text-[1.1rem]",
                    pageTone.title,
                  ].join(" ")}
                >
                  {page.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (authenticated) {
                    logout();
                    return;
                  }

                  router.push("/login");
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] sm:w-auto sm:px-3.5"
                aria-label={authenticated ? authCopy.signOutLabel : authCopy.loginButtonLabel}
              >
                <span className="hidden text-sm font-semibold sm:inline">
                  {authenticated ? authCopy.signOutLabel : authCopy.loginButtonLabel}
                </span>
                <span className="sm:hidden">
                  <UserIcon />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] sm:w-auto sm:px-3.5"
                aria-label="Toggle theme"
              >
                <span className="hidden text-sm font-semibold sm:inline">
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
                <span className="sm:hidden">
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] lg:hidden"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </header>

        {mobileOpen ? (
          <div className="mx-4 mt-3 panel rounded-[1.25rem] p-3.5 sm:mx-6 lg:hidden">
            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                if (item.authOnly && !authenticated) {
                  return null;
                }

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
            <div className="mt-4 space-y-3 border-t border-[color:var(--border)] pt-4">
              <div className="rounded-[1.25rem] bg-[color:var(--surface-soft)] px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
                  Signed in as
                </p>
                <p className="mt-2 truncate text-sm font-semibold text-[color:var(--foreground-strong)]">
                  {user?.displayName ?? authCopy.guestLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-left text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
              >
                {authCopy.signOutLabel}
              </button>
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

function isActiveLink(pathname: string | null, href: string) {
  if (!pathname) return false;

  return pathname === href || (href === "/opportunities" && pathname === "/") || pathname.startsWith(href);
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5V4.8M12 19.2V21.5M2.5 12H4.8M19.2 12H21.5M5.2 5.2L6.8 6.8M17.2 17.2L18.8 18.8M18.8 5.2L17.2 6.8M6.8 17.2L5.2 18.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M20.2 15.6A8.5 8.5 0 0 1 8.4 3.8a8.8 8.8 0 1 0 11.8 11.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 12.2A4.1 4.1 0 1 0 12 4a4.1 4.1 0 0 0 0 8.2ZM4.8 20c1.2-3 3.8-4.7 7.2-4.7s6 1.7 7.2 4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
