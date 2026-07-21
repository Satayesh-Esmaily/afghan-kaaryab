"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DatePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

type CalendarCell = {
  key: string;
  date: Date | null;
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DatePickerField({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

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

  const calendar = useMemo(() => buildCalendar(viewDate), [viewDate]);
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const selectedLabel = selectedDate ? formatDisplayDate(selectedDate) : "";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          "ds-input flex min-h-[3rem] items-center justify-between gap-3 text-start transition",
          disabled ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={selectedLabel ? "text-[color:var(--foreground)]" : "text-[color:var(--foreground-muted)]"}>
          {selectedLabel || placeholder}
        </span>
        <CalendarIcon />
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-2xl">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setViewDate((current) => addMonths(current, -1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
              aria-label="Previous month"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={currentMonth}
                onChange={(event) => setViewDate((current) => new Date(current.getFullYear(), Number(event.target.value), 1))}
                className="ds-input rounded-[0.9rem] px-3 py-2 text-sm"
              >
                {monthLabels.map((label, index) => (
                  <option key={label} value={index}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={currentYear}
                onChange={(event) => setViewDate((current) => new Date(Number(event.target.value), current.getMonth(), 1))}
                className="ds-input rounded-[0.9rem] px-3 py-2 text-sm"
              >
                {buildYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setViewDate((current) => addMonths(current, 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
              aria-label="Next month"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-[color:var(--foreground-muted)]">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {calendar.map((cell) => {
              const date = cell.date;

              if (!date) {
                return <div key={cell.key} className="aspect-square" />;
              }

              const active = selectedDate && isSameDay(date, selectedDate);
              const isCurrentMonth = date.getMonth() === viewDate.getMonth();
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => {
                    onChange(toIsoDate(date));
                    setOpen(false);
                  }}
                  className={[
                    "aspect-square rounded-[0.95rem] transition",
                    active
                      ? "bg-[color:var(--accent)] text-white shadow-lg shadow-[rgba(114,93,255,0.24)]"
                      : isCurrentMonth
                        ? "text-[color:var(--foreground)] hover:bg-[color:var(--surface-soft)]"
                        : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-soft)]",
                    isToday && !active ? "ring-1 ring-[color:var(--accent-soft)]" : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildCalendar(viewDate: Date): CalendarCell[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let index = startDay - 1; index >= 0; index -= 1) {
    const date = new Date(year, month - 1, previousMonthDays - index);
    cells.push({ key: `prev-${index}`, date });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ key: `day-${day}`, date: new Date(year, month, day) });
  }

  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const trailingCells = totalCells - cells.length;

  for (let offset = 1; offset <= trailingCells; offset += 1) {
    cells.push({ key: `next-${offset}`, date: new Date(year, month + 1, offset) });
  }

  return cells;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseIsoDate(value: string) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(date: Date) {
  const day = date.getDate();
  const month = monthLabels[date.getMonth()] ?? "";
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function buildYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = currentYear; year >= currentYear - 80; year -= 1) {
    years.push(year);
  }

  return years;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0 text-[color:var(--foreground-muted)]" fill="none" aria-hidden="true">
      <path d="M6 3.5V5M14 3.5V5M4.5 7.5h11M5.5 4.5h9A1.5 1.5 0 0 1 16 6v8A1.5 1.5 0 0 1 14.5 15.5h-9A1.5 1.5 0 0 1 4 14V6A1.5 1.5 0 0 1 5.5 4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M12.5 5 7.5 10l5 5" : "M7.5 5 12.5 10l-5 5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
