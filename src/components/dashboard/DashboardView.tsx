"use client";

import { useAppData } from "@/context/app-context";
import { getDashboardStats } from "@/lib/opportunities";
import DashboardHeroSection from "@/components/dashboard/sections/DashboardHeroSection";
import DashboardCalendarSection from "@/components/dashboard/sections/DashboardCalendarSection";
import DashboardOpportunityStatsSection from "@/components/dashboard/sections/DashboardOpportunityStatsSection";
import DashboardCategoryBreakdownSection from "@/components/dashboard/sections/DashboardCategoryBreakdownSection";
import DashboardRecentSubmissionsSection from "@/components/dashboard/sections/DashboardRecentSubmissionsSection";
import DashboardQuickInsightSection from "@/components/dashboard/sections/DashboardQuickInsightSection";

export default function DashboardView() {
  const { opportunities } = useAppData();
  const stats = getDashboardStats(opportunities);
  const savedCount = opportunities.length - stats.recent.length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <DashboardHeroSection stats={stats} savedCount={savedCount} />
        <DashboardCalendarSection />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <DashboardOpportunityStatsSection stats={stats} />
          <DashboardCategoryBreakdownSection categories={stats.categories} />
        </div>

        <div className="space-y-5">
          <DashboardRecentSubmissionsSection recent={stats.recent} />
          <DashboardQuickInsightSection />
        </div>
      </section>
    </div>
  );
}
