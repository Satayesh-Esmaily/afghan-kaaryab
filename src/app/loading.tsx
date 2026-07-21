export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 lg:px-8"
      aria-busy="true"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading KaarYab Afghanistan</span>
      <div className="relative w-full max-w-[1600px] overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_60px_rgba(15,16,19,0.08)] loading-fade-up">
        <div className="absolute inset-x-0 top-0 h-1.5 overflow-hidden bg-[linear-gradient(90deg,var(--accent),rgba(81,196,255,0.75),rgba(70,208,123,0.75),var(--accent))]" aria-hidden="true">
          <span className="loading-sweep absolute inset-y-0 start-0 w-1/3 bg-white/55 blur-[1px]" />
        </div>

        <div className="grid min-h-[calc(100vh-2rem)] lg:grid-cols-[276px_minmax(0,1fr)]">
          <aside className="hidden flex-col border-e border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4 lg:flex">
            <div className="panel flex items-center gap-3 rounded-[1.25rem] px-3.5 py-3.5">
              <div className="loading-breathe grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] bg-[linear-gradient(135deg,var(--accent),rgba(81,196,255,0.9))] shadow-lg shadow-[rgba(114,93,255,0.18)]">
                <div className="h-5 w-5 rounded-full border-2 border-white/90" />
              </div>
              <div className="min-w-0 space-y-2">
                <div className="h-3 w-24 rounded-full bg-[color:var(--surface-strong)]" />
                <div className="h-2.5 w-32 rounded-full bg-[color:var(--surface-strong)]/85" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLine key={index} className={index === 0 ? "active-pill" : ""} />
              ))}
            </div>

            <div className="mt-auto space-y-3 border-t border-[color:var(--border)] pt-4">
              <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-4">
                <div className="h-2.5 w-24 rounded-full bg-[color:var(--surface-strong)]" />
                <div className="mt-3 h-3 w-36 rounded-full bg-[color:var(--surface-strong)]/85" />
                <div className="mt-2 h-2.5 w-28 rounded-full bg-[color:var(--surface-strong)]/70" />
              </div>
              <div className="h-11 rounded-full bg-[color:var(--surface)]" />
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="border-b border-[color:var(--border)] bg-[color:var(--background)]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 lg:hidden">
                  <div className="flex items-center gap-3">
                    <div className="loading-breathe grid h-10 w-10 place-items-center rounded-[1rem] bg-[linear-gradient(135deg,var(--accent),rgba(81,196,255,0.9))] shadow-lg shadow-[rgba(114,93,255,0.16)]">
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-white/90" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded-full bg-[color:var(--surface-strong)]" />
                      <div className="h-2.5 w-28 rounded-full bg-[color:var(--surface-strong)]/85" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-16 rounded-full bg-[color:var(--surface-soft)]" />
                    <div className="h-10 w-10 rounded-full bg-[color:var(--surface-soft)]" />
                  </div>
                </div>

                <div className="hidden items-center justify-between gap-3 lg:flex">
                  <div className="inline-flex items-center gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 shadow-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded-full bg-[color:var(--surface-strong)]" />
                      <div className="h-2.5 w-44 rounded-full bg-[color:var(--surface-strong)]/80" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-11 w-28 rounded-full bg-[color:var(--surface-soft)]" />
                    <div className="h-11 w-24 rounded-full bg-[color:var(--surface-soft)]" />
                    <div className="h-11 w-11 rounded-full bg-[color:var(--surface-soft)]" />
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
              <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <section className="space-y-5">
                  <div className="rounded-[1.75rem] panel overflow-hidden">
                    <div className="accent-panel px-6 py-6 sm:px-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="h-3 w-20 rounded-full bg-white/35" />
                          <div className="h-8 w-[min(24rem,85%)] rounded-full bg-white/20" />
                          <div className="h-3 w-[min(32rem,92%)] rounded-full bg-white/15" />
                        </div>
                        <div className="hidden h-16 w-16 rounded-[1.5rem] border border-white/20 bg-white/10 sm:block" />
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-4">
                            <div className="h-2.5 w-16 rounded-full bg-white/25" />
                            <div className="mt-3 h-6 w-12 rounded-full bg-white/20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                </section>

                <aside className="space-y-5">
                  <SkeletonCard compact />
                  <SkeletonCard compact />
                  <SkeletonCard compact />
                </aside>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={["h-11 rounded-[1rem] bg-[color:var(--surface)]", className].join(" ")} />;
}

function SkeletonCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-[1.5rem] panel overflow-hidden">
      <div className="border-b border-[color:var(--border)] px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-[color:var(--surface-strong)]" />
            <div className={compact ? "h-5 w-36 rounded-full bg-[color:var(--surface-strong)]/85" : "h-6 w-44 rounded-full bg-[color:var(--surface-strong)]/85"} />
            {!compact ? <div className="h-3 w-52 rounded-full bg-[color:var(--surface-strong)]/70" /> : null}
          </div>
          <div className="h-10 w-10 rounded-full bg-[color:var(--surface-soft)]" />
        </div>
      </div>
      <div className="space-y-3 px-5 py-5 sm:px-6">
        <div className="h-3 w-full rounded-full bg-[color:var(--surface-strong)]/75" />
        <div className="h-3 w-11/12 rounded-full bg-[color:var(--surface-strong)]/65" />
        <div className="h-3 w-10/12 rounded-full bg-[color:var(--surface-strong)]/55" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-[1.1rem] bg-[color:var(--surface-soft)]" />
          <div className="h-20 rounded-[1.1rem] bg-[color:var(--surface-soft)]" />
        </div>
      </div>
    </section>
  );
}
