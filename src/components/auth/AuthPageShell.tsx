import Image from "next/image";
import type { ReactNode } from "react";
import { brand } from "@/config/navigation";
import { Link as IntlLink } from "@/i18n/navigation";

export default function AuthPageShell({
  title,
  subtitle,
  introEyebrow,
  introTitle,
  introBody,
  highlights,
  backLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  highlights: string[];
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden flex-col justify-between border-r border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(110,91,255,0.08),rgba(81,196,255,0.08),rgba(70,208,123,0.06))] px-8 py-8 lg:flex xl:px-10">
          <IntlLink href="/" className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
              <Image src={brand.logoSrc} alt={brand.logoAlt} fill sizes="44px" className="object-cover" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--foreground-strong)]">
              {brand.name}
            </span>
          </IntlLink>

          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground-muted)]">
              {introEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--foreground-strong)]">
              {introTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--foreground-muted)]">{introBody}</p>
          </div>

          <div className="space-y-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[1.15rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm font-medium text-[color:var(--foreground-strong)]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                {item}
              </div>
            ))}
          </div>
        </aside>

        <section className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4 sm:px-6">
            <IntlLink href="/" className="flex items-center gap-3 lg:hidden">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
                <Image src={brand.logoSrc} alt={brand.logoAlt} fill sizes="40px" className="object-cover" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-[color:var(--foreground-strong)]">
                {brand.name}
              </span>
            </IntlLink>

            <IntlLink
              href="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
              aria-label={backLabel}
            >
              <BackIcon />
            </IntlLink>
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 sm:px-10 sm:py-14">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)] sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--foreground-muted)] sm:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="mt-8 flex-1">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
