"use client";

import { useState } from "react";

export default function DashboardCalendarSection() {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const displayedMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const calendar = buildCalendar(displayedMonth);
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(displayedMonth);
  const isCurrentMonth = monthOffset === 0;

  return (
    <div className="rounded-[1.5rem] panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthOffset((value) => value - 1)}
          className="text-2xl text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground)]"
          aria-label="Previous month"
        >
          {"<"}
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-[color:var(--foreground-strong)]">{monthLabel}</p>
          <p className="text-sm text-[color:var(--foreground-muted)]">Deadline calendar</p>
        </div>
        <button
          type="button"
          onClick={() => setMonthOffset((value) => value + 1)}
          className="text-2xl text-[color:var(--foreground-muted)] transition hover:text-[color:var(--foreground)]"
          aria-label="Next month"
        >
          {">"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-medium text-[color:var(--foreground-muted)]">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {calendar.map((day, index) => (
          <CalendarCell key={`${day}-${index}`} day={day} active={isCurrentMonth && day === today.getDate()} />
        ))}
      </div>
    </div>
  );
}

function CalendarCell({ day, active }: { day: number | null; active?: boolean }) {
  if (day === null) {
    return <div className="h-10" />;
  }

  return (
    <div
      className={[
        "flex h-10 items-center justify-center rounded-full text-sm",
        active ? "active-pill font-semibold" : "text-[color:var(--foreground-muted)]",
      ].join(" ")}
    >
      {day}
    </div>
  );
}

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ];
}
