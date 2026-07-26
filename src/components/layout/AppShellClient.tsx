"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const activePagePath =
    (normalizedPathname === "/" ? "/dashboard" : undefined) ??
    pageHeaderOrder.find((path) =>
      path === "/" ? normalizedPathname === "/" : normalizedPathname?.startsWith(path)
    ) ??
    "/dashboard";
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
    <div className="app-shell-root min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <aside className="app-shell-sidebar fixed inset-y-0 start-0 hidden w-[276px] flex-col border-e border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4 lg:flex">
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

        <div className="mt-4 flex-1 overflow-y-auto pe-1">
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
                  <div className="min-w-0 flex-1 ps-1">
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
            className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-start text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
          >
            {tNav("auth.logout")}
          </button>
        </div>
      </aside>

      <div className="lg:ps-[276px]">
        <header className="app-shell-header sticky top-0 z-40 bg-[color:var(--background)]">
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
          <div className="app-shell-mobile-nav mx-4 mt-3 panel rounded-[1.25rem] p-3.5 sm:mx-6 lg:hidden">
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
                    <span className="flex-1 ps-1">{tNav(item.labelKey)}</span>
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
                className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-start text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
              >
                {tNav("auth.logout")}
              </button>
            </div>
          </div>
        ) : null}

        <main className="app-shell-main mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <div className="app-shell-footer">{footer}</div>
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
  const normalizedPathname = stripLocalePrefix(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const localeOptions = useMemo(
    () =>
      locales.map((option) => ({
        value: option,
        label:
          option === "en"
            ? tCommon("languageOptions.en")
            : option === "fa-AF"
              ? tCommon("languageOptions.faAF")
              : tCommon("languageOptions.psAF"),
      })),
    [tCommon]
  );

  const currentOption = localeOptions.find((option) => option.value === currentLocale) ?? localeOptions[0];

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "inline-flex h-11 min-w-[8.75rem] items-center justify-between gap-3 rounded-full border px-3.5 text-sm font-medium transition",
          "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]",
          open ? "shadow-lg shadow-[rgba(114,93,255,0.12)] ring-4 ring-[color:var(--accent-soft)]/50" : "shadow-sm",
        ].join(" ")}
        aria-label={tCommon("language")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-soft))] text-[11px] font-semibold text-[color:var(--accent-strong)]">
            {currentOption?.value === "en" ? "EN" : currentOption?.value === "fa-AF" ? "FA" : "PS"}
          </span>
          <span className="truncate">{currentOption?.label ?? tCommon("language")}</span>
        </span>
        <ChevronDownIcon className={open ? "rotate-180" : ""} />
      </button>

      {open ? (
        <div className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_22px_50px_rgba(15,16,19,0.16)]">
          <div className="border-b border-[color:var(--border)] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
              {tCommon("language")}
            </p>
          </div>
          <div className="p-2">
            {localeOptions.map((option) => {
              const active = option.value === currentLocale;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.replace(normalizedPathname, { locale: option.value as Locale });
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-[0.95rem] px-3.5 py-3 text-start text-sm transition",
                    active
                      ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]",
                  ].join(" ")}
                >
                  <span className="font-medium">{option.label}</span>
                  {active ? (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[color:var(--accent)] text-[10px] font-bold text-white">
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
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

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4.5 w-4.5 shrink-0 transition ${className}`} fill="none" aria-hidden="true">
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
