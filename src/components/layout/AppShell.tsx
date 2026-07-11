"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppData } from "@/context/app-context";
import { authCopy } from "@/config/auth";
import Footer from "@/components/layout/Footer";
import { brand, pageHeaders, pageTones, sidebarItems } from "@/config/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedIds, theme, setTheme, user, authenticated, hydrated, logout } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedCount = savedIds.length;
  const isLoginRoute = pathname === "/login";

  const activePath = Object.keys(pageHeaders).find((path) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path)
  );
  const page = pageHeaders[activePath ?? "/opportunities"];
  const pageTone = pageTones[activePath ?? "/opportunities"] ?? pageTones["/opportunities"];

  useEffect(() => {
    if (!hydrated) return;

    if (!authenticated && !isLoginRoute) {
      router.replace("/login");
      return;
    }

    if (authenticated && isLoginRoute) {
      router.replace("/dashboard");
      return;
    }

    if (authenticated && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [authenticated, hydrated, isLoginRoute, pathname, router]);

  if (!hydrated && !isLoginRoute) {
    return <AppLoadingState />;
  }

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  if (!authenticated) {
    return <AppLoadingState />;
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
              router.replace("/login");
            }}
            className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-left text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
          >
            {authCopy.signOutLabel}
          </button>
        </div>

      </aside>

      <div className="lg:pl-[276px]">
        <header className="sticky top-0 z-40 bg-[color:var(--background)]">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-sm">
              <span className={["h-2.5 w-2.5 rounded-full", pageTone.dot].join(" ")} />
              <div className="min-w-0">
                <h1
                  className={[
                    "text-[1.05rem] font-semibold tracking-tight sm:text-[1.25rem]",
                    pageTone.title,
                  ].join(" ")}
                >
                  {page.title}
                </h1>
                <p className="mt-0.5 max-w-[42ch] truncate text-xs text-[color:var(--foreground-muted)] sm:text-sm">
                  {page.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 sm:inline-flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full accent-panel text-xs font-semibold text-white">
                  {getInitials(user?.displayName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[color:var(--foreground)]">
                    {user?.displayName ?? authCopy.guestLabel}
                  </p>
                </div>
              </div>
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
                  router.replace("/login");
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

function getInitials(name?: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function AppLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-4">
      <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-4 text-sm font-medium text-[color:var(--foreground-muted)] shadow-sm">
        {authCopy.loadingText}
      </div>
    </div>
  );
}
