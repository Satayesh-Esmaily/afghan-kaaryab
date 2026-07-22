import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { formatDeadline } from "@/lib/opportunities";

export default function DashboardRecentSubmissionsSection({
  recent,
}: {
  recent: Array<{
    id: string;
    organization: string;
    title: string;
    deadline: string;
  }>;
}) {
  const t = useTranslations("dashboard.recent");

  return (
    <div className="rounded-[1.5rem] panel p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{t("title")}</h3>
        <Link
          href="/add-opportunity"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full accent-button"
          aria-label={t("addOpportunityLabel")}
        >
          +
        </Link>
      </div>
      <div className="mt-6 space-y-5">
        {recent.map((opportunity, index) => (
          <Link
            key={opportunity.id}
            href={`/opportunities/${opportunity.id}`}
            className={[
              "relative block w-full overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] px-4 py-4 shadow-sm transition sm:px-5 dark:border-white/10",
              index % 4 === 0
                ? "bg-[linear-gradient(180deg,#fff6f1,rgba(255,246,241,0.9))] dark:bg-[linear-gradient(180deg,rgba(255,90,31,0.18),rgba(255,90,31,0.08))]"
                : index % 4 === 1
                  ? "bg-[linear-gradient(180deg,#f4f0ff,rgba(244,240,255,0.9))] dark:bg-[linear-gradient(180deg,rgba(114,93,255,0.18),rgba(114,93,255,0.08))]"
                  : index % 4 === 2
                    ? "bg-[linear-gradient(180deg,#eef9ef,rgba(238,249,239,0.9))] dark:bg-[linear-gradient(180deg,rgba(52,199,89,0.16),rgba(52,199,89,0.07))]"
                    : "bg-[linear-gradient(180deg,#fff9e8,rgba(255,249,232,0.9))] dark:bg-[linear-gradient(180deg,rgba(255,204,0,0.16),rgba(255,204,0,0.07))]",
              "dark:shadow-black/20",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-sm",
                      index % 4 === 0
                        ? "bg-[#ff5a1f]"
                        : index % 4 === 1
                          ? "bg-[color:var(--accent)]"
                          : index % 4 === 2
                            ? "bg-[color:var(--success)]"
                            : "bg-[color:var(--warning)]",
                    ].join(" ")}
                  />
                  <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
                    {opportunity.organization}
                  </p>
                </div>
                <p className="mt-2 text-[1.05rem] font-medium leading-6 text-[color:var(--foreground)]">
                  {opportunity.title}
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">
                  {t("deadlinePrefix")} {formatDeadline(opportunity.deadline)}
                </p>
              </div>
              <span
                className="rounded-full px-1 text-lg leading-none text-[color:var(--foreground)]"
                aria-label={t("moreOptionsLabel")}
              >
                ...
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
