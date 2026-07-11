import { dashboardCopy } from "@/config/dashboard";

export default function DashboardQuickInsightSection() {
  return (
    <div className="rounded-[1.5rem] accent-panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
        {dashboardCopy.quickInsightKicker}
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{dashboardCopy.quickInsightTitle}</h3>
      <p className="mt-3 text-sm leading-7 text-white/85">{dashboardCopy.quickInsightBody}</p>
    </div>
  );
}
