"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useAuthContext } from "@/context/auth-context";
import { useThemeContext } from "@/context/theme-context";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/config";
import { stripLocalePrefix } from "@/i18n/utils";
import {
  brand,
  isShellLinkActive,
  pageHeaderOrder,
  pageHeaders,
  pageTones,
  sidebarItems,
} from "@/config/navigation";
import ShellSavedCount from "@/components/layout/ShellSavedCount";

type AppShellClientProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AppShellClient({ children, footer }: AppShellClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const normalizedPathname = stripLocalePrefix(pathname);
  const { theme, setTheme } = useThemeContext();
  const { user, authenticated, logout, hydrated, authReady } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthRoute = normalizedPathname === "/login" || normalizedPathname === "/signup";
  const isAppReady = hydrated && authReady;
  const activePagePath = pageHeaderOrder.find((path) =>
    path === "/" ? normalizedPathname === "/" : normalizedPathname?.startsWith(path)
  ) ?? "/opportunities";
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

              const active = isShellLinkActive(normalizedPathname, item.href);

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
                    <p className="truncate text-[14px] font-medium leading-5">{tNav(item.labelKey)}</p>
                  </div>

                  {item.href === "/saved" ? <ShellSavedCount active={active} /> : null}
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
                  {tNav(page.titleKey)}
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

              <LocaleSwitcher currentLocale={locale} />

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

                const active = isShellLinkActive(normalizedPathname, item.href);

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
                    <span className="flex-1 pl-1">{tNav(item.labelKey)}</span>
                    {item.href === "/saved" ? <ShellSavedCount active={active} mobile /> : null}
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

        {footer}
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

function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const tCommon = useTranslations("common");

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{tCommon("language")}</span>
      <select
        aria-label={tCommon("language")}
        value={currentLocale}
        onChange={(event) => {
          router.replace(pathname, { locale: event.target.value as Locale });
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
