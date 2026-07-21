"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SelectOption } from "@/data/profile-options";

type SearchableSelectProps = {
  value: string;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function SearchableSelect({
  value,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled = false,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(() => options.find((option) => option.value === value) ?? null, [options, value]);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          "ds-input flex min-h-[3.15rem] items-center justify-between gap-3.5 px-4 py-3 text-start shadow-sm transition",
          "hover:border-[color:var(--accent-soft)] hover:bg-[color:var(--surface-soft)] hover:shadow-md",
          "focus:border-[color:var(--accent)] focus:shadow-[0_0_0_4px_rgba(114,93,255,0.14)]",
          open ? "border-[color:var(--accent-soft)] bg-[color:var(--surface-soft)] shadow-md" : "",
          disabled ? "cursor-not-allowed opacity-60 hover:border-[color:var(--border)] hover:bg-[color:var(--surface)] hover:shadow-sm" : "",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-soft))] text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--accent-strong)]">
            {selectedOption?.label?.slice(0, 2) ?? "•"}
          </span>
          <span
            className={[
              "truncate text-sm font-medium",
              selectedOption ? "text-[color:var(--foreground)]" : "text-[color:var(--foreground-muted)]",
            ].join(" ")}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronIcon className={open ? "rotate-180 text-[color:var(--accent)]" : ""} />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_22px_50px_rgba(15,16,19,0.16)]">
          {options.length > 8 ? (
            <div className="border-b border-[color:var(--border)] bg-[color:var(--surface-soft)] p-3">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="ds-input rounded-[1rem] border-[color:var(--border)] bg-[color:var(--surface)] py-2.75 text-sm shadow-sm focus:border-[color:var(--accent)]"
              />
            </div>
          ) : null}

          <div className="max-h-72 overflow-auto p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-[1rem] px-3.5 py-3 text-start text-sm transition",
                      active
                        ? "bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                        : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold uppercase tracking-[0.12em]",
                          active
                            ? "bg-white text-[color:var(--accent-strong)]"
                            : "bg-[color:var(--surface)] text-[color:var(--accent-strong)]",
                        ].join(" ")}
                      >
                        {option.label.slice(0, 2)}
                      </span>
                      <span className="truncate font-medium">{option.label}</span>
                    </span>
                    {active ? <CheckIcon /> : <span className="h-4.5 w-4.5" aria-hidden="true" />}
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-6 text-sm text-[color:var(--foreground-muted)]">No matches found.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4.5 w-4.5 shrink-0 text-[color:var(--foreground-muted)] transition ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0 text-[color:var(--accent)]" fill="none" aria-hidden="true">
      <path d="M4.5 10.5 8 14l7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
