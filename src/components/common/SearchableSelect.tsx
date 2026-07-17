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
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          "ds-input flex min-h-[3rem] items-center justify-between gap-3 text-left transition",
          disabled ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={selectedOption ? "text-[color:var(--foreground)]" : "text-[color:var(--foreground-muted)]"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronIcon className={open ? "rotate-180" : ""} />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl">
          {options.length > 8 ? (
            <div className="border-b border-[color:var(--border)] p-3">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="ds-input rounded-[0.9rem] py-2.5"
              />
            </div>
          ) : null}

          <div className="max-h-64 overflow-auto p-2">
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
                    }}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-[0.95rem] px-3 py-2.5 text-left text-sm transition",
                      active ? "bg-[color:var(--surface-soft)] text-[color:var(--foreground-strong)]" : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]",
                    ].join(" ")}
                  >
                    <span className="truncate">{option.label}</span>
                    {active ? <CheckIcon /> : null}
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
    <svg viewBox="0 0 20 20" className={`h-4.5 w-4.5 shrink-0 text-[color:var(--foreground-muted)] transition ${className}`} fill="none" aria-hidden="true">
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
