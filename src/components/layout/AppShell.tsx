"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useAppData } from "@/context/app-context";
import Footer from "@/components/layout/Footer";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { brand, pageTones } from "@/config/navigation";
import { locales, type Locale } from "@/i18n/config";
import { stripLocalePrefix } from "@/i18n/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const normalizedPathname = stripLocalePrefix(pathname);
  const pageHeaders = {
    "/": { title: tNav("pages.home.title"), subtitle: tNav("pages.home.subtitle") },
    "/dashboard": { title: tNav("pages.dashboard.title"), subtitle: tNav("pages.dashboard.subtitle") },
    "/profile": { title: tNav("pages.profile.title"), subtitle: tNav("pages.profile.subtitle") },
    "/resume-builder": { title: tNav("pages.resumeBuilder.title"), subtitle: tNav("pages.resumeBuilder.subtitle") },
    "/opportunities": { title: tNav("pages.discover.title"), subtitle: tNav("pages.discover.subtitle") },
    "/organizations": { title: tNav("pages.directory.title"), subtitle: tNav("pages.directory.subtitle") },
    "/saved": { title: tNav("pages.saved.title"), subtitle: tNav("pages.saved.subtitle") },
    "/add-opportunity": { title: tNav("pages.addOpportunity.title"), subtitle: tNav("pages.addOpportunity.subtitle") },
    "/about": { title: tNav("pages.about.title"), subtitle: tNav("pages.about.subtitle") },
    "/contact": { title: tNav("pages.contact.title"), subtitle: tNav("pages.contact.subtitle") },
    "/settings": { title: tNav("pages.settings.title"), subtitle: tNav("pages.settings.subtitle") },
  } as const;
  const sidebarItems: Array<{ href: string; label: string; authOnly?: boolean }> = [
    { href: "/dashboard", label: tNav("sidebar.dashboard") },
    { href: "/profile", label: tNav("sidebar.profile"), authOnly: true },
    { href: "/resume-builder", label: tNav("sidebar.resumeBuilder"), authOnly: true },
    { href: "/opportunities", label: tNav("sidebar.discover") },
    { href: "/organizations", label: tNav("sidebar.directory") },
    { href: "/saved", label: tNav("sidebar.saved") },
    { href: "/add-opportunity", label: tNav("sidebar.addOpportunity") },
    { href: "/about", label: tNav("sidebar.about") },
    { href: "/contact", label: tNav("sidebar.contact") },
    { href: "/settings", label: tNav("sidebar.settings") },
  ] as const;
  const { savedIds, theme, setTheme, user, authenticated, logout, hydrated, authReady } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedCount = savedIds.length;
  const isAuthRoute = normalizedPathname === "/login" || normalizedPathname === "/signup";
  const isAppReady = hydrated && authReady;
  const activePath = Object.keys(pageHeaders).find((path) =>
    path === "/" ? normalizedPathname === "/" : normalizedPathname?.startsWith(path)
  );
  const activePagePath = (activePath ?? "/opportunities") as keyof typeof pageHeaders;
  const page = pageHeaders[activePagePath];
  const pageTone = pageTones[activePagePath] ?? pageTones["/opportunities"];

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    );
  }

  if (!isAppReady) {
    return <LoadingShell />;
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 hidden w-[276px] flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 lg:flex">
        <Link
          href="/"
          className="panel group rounded-[1.25rem] px-3.5 py-3.5 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
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

              const active = isActiveLink(normalizedPathname, item.href);

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
              {tNav("auth.signedInAs")}
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-[color:var(--foreground-strong)]">
              {user?.displayName ?? tNav("auth.guest")}
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
            {tNav("auth.logout")}
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
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3.5 text-[color:var(--foreground)]"
                aria-label={authenticated ? tNav("auth.logout") : tNav("auth.login")}
              >
                <span className="text-sm font-semibold">{authenticated ? tNav("auth.logout") : tNav("auth.login")}</span>
              </button>

              <LocaleSwitcher />

              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3.5 text-[color:var(--foreground)]"
                aria-label={theme === "dark" ? tCommon("theme.light") : tCommon("theme.dark")}
              >
                <span className="text-sm font-semibold">
                  {theme === "dark" ? tCommon("theme.light") : tCommon("theme.dark")}
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

                const active = isActiveLink(normalizedPathname, item.href);

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
                  {tNav("auth.signedInAs")}
                </p>
                <p className="mt-2 truncate text-sm font-semibold text-[color:var(--foreground-strong)]">
                  {user?.displayName ?? tNav("auth.guest")}
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
                {tNav("auth.logout")}
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

function LoadingShell() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="flex flex-col items-center gap-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-5 shadow-sm">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[color:var(--surface-soft)]" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-[color:var(--surface-soft)]" />
        <div className="h-2 w-40 animate-pulse rounded-full bg-[color:var(--surface-soft)]" />
      </div>
    </div>
  );
}

function isActiveLink(pathname: string | null, href: string) {
  if (!pathname) return false;

  return pathname === href || (href === "/opportunities" && pathname === "/") || pathname.startsWith(href);
}

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const tCommon = useTranslations("common");
  const activePath = stripLocalePrefix(pathname);

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{tCommon("language")}</span>
      <select
        aria-label={tCommon("language")}
        value={locale}
        onChange={(event) => {
          router.replace(activePath, { locale: event.target.value as Locale });
        }}
        className="h-11 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm font-medium text-[color:var(--foreground)] outline-none transition hover:bg-[color:var(--surface-soft)]"
      >
        {locales.map((option) => (
          <option key={option} value={option}>
            {option === "en"
              ? tCommon("languageOptions.en")
              : option === "fa-AF"
                ? tCommon("languageOptions.faAF")
                : tCommon("languageOptions.psAF")}
          </option>
        ))}
      </select>
    </label>
  );
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
