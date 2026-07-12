import LoginForm from "@/components/auth/LoginForm";
import { Badge } from "@/components/ui";
import { authCopy } from "@/config/auth";

export default function LoginView() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section className="rounded-[2rem] accent-panel p-6 sm:p-8 lg:p-10">
        <Badge tone="accent">{authCopy.loginEyebrow}</Badge>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {authCopy.loginTitle}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
          {authCopy.loginDescription}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Dashboard", "Personalized overview after sign in"],
            ["Saved items", "Keep track of opportunities you bookmarked"],
            ["Organizations", "Follow employers and institutions you trust"],
            ["Settings", "Adjust your account and display preferences"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[1.25rem] border border-white/12 bg-white/10 px-4 py-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm text-white/80">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
            {authCopy.appName}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground-strong)]">
            {authCopy.welcomeLabel}
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
