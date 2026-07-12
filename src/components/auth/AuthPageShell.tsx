import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/config/navigation";

export default function AuthPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl min-h-[calc(100vh-4rem)] overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-2xl">
            <Image src={brand.logoSrc} alt={brand.logoAlt} fill sizes="40px" className="object-cover" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-[color:var(--foreground-strong)]">
            {brand.name}
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
          aria-label="Back to home"
        >
          ⌂
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-12 sm:px-10 sm:py-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground-strong)] sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
