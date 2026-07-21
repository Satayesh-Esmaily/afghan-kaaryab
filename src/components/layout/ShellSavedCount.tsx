"use client";

import { useOpportunitiesContext } from "@/context/opportunities-context";

type ShellSavedCountProps = {
  active: boolean;
  mobile?: boolean;
};

export default function ShellSavedCount({ active, mobile = false }: ShellSavedCountProps) {
  const { savedIds } = useOpportunitiesContext();
  const savedCount = savedIds.length;

  if (savedCount === 0) {
    return null;
  }

  if (mobile) {
    return (
      <span className="rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--accent)]">
        {savedCount}
      </span>
    );
  }

  return (
    <span
      className={[
        "rounded-full px-2 py-0.5 text-[10px] font-bold",
        active ? "bg-white/20 text-white" : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
      ].join(" ")}
    >
      {savedCount}
    </span>
  );
}
