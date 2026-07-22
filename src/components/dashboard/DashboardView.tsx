"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/context/auth-context";
import { useOpportunitiesContext } from "@/context/opportunities-context";
import { getDashboardStats } from "@/lib/opportunities";
import DashboardHeroSection from "@/components/dashboard/sections/DashboardHeroSection";
import DashboardCalendarSection from "@/components/dashboard/sections/DashboardCalendarSection";
import DashboardOpportunityStatsSection from "@/components/dashboard/sections/DashboardOpportunityStatsSection";
import DashboardCategoryBreakdownSection from "@/components/dashboard/sections/DashboardCategoryBreakdownSection";
import DashboardRecentSubmissionsSection from "@/components/dashboard/sections/DashboardRecentSubmissionsSection";
import DashboardQuickInsightSection from "@/components/dashboard/sections/DashboardQuickInsightSection";

export default function DashboardView() {
  const searchParams = useSearchParams();
  const t = useTranslations("dashboard");
  const { user } = useAuthContext();
  const { opportunities } = useOpportunitiesContext();
  const stats = getDashboardStats(opportunities);
  const savedCount = opportunities.length - stats.recent.length;
  const showWelcome = searchParams.get("status") === "welcome";

  return (
    <div className="space-y-8">
      {showWelcome ? (
        <div className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-sm sm:px-6">
          <p className="text-sm font-semibold text-[color:var(--foreground-strong)]">
            {t("welcomeBanner.title")}
            {user?.displayName ? `, ${user.displayName}` : ""}.
          </p>
          <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{t("welcomeBanner.description")}</p>
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <DashboardHeroSection stats={stats} savedCount={savedCount} userName={user?.displayName ?? undefined} />
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
