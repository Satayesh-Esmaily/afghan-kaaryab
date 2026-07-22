import { useTranslations } from "next-intl";

export default function DashboardQuickInsightSection() {
  const t = useTranslations("dashboard.quickInsight");

  return (
    <div className="rounded-[1.5rem] accent-panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{t("kicker")}</p>
      <h3 className="mt-3 text-2xl font-semibold">{t("title")}</h3>
      <p className="mt-3 text-sm leading-7 text-white/85">{t("body")}</p>
    </div>
  );
}
