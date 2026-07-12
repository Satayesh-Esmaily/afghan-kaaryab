import Link from "next/link";
import { Badge } from "@/components/ui";
import { dashboardCopy } from "@/config/dashboard";

export default function DashboardTodayTasksSection({
  tasks,
}: {
  tasks: string[];
}) {
  return (
    <div className="rounded-[1.5rem] panel p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{dashboardCopy.tasksTitle}</h3>
        <Link href="/saved" className="text-sm font-medium text-[color:var(--foreground-muted)]">
          {dashboardCopy.tasksSeeAll}
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {tasks.map((task, index) => (
          <div key={task} className="flex items-center justify-between rounded-[1.5rem] panel-soft px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-[color:var(--foreground)]">{task}</p>
                <p className="text-sm text-[color:var(--foreground-muted)]">Keep the listing board up to date</p>
              </div>
            </div>
            <Badge tone="info">Done</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
