import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { Link } from "@/i18n/navigation";

export default async function LoginView() {
  const t = await getTranslations("auth");

  return (
    <AuthPageShell
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
      introEyebrow={t("sidebar.introEyebrow")}
      introTitle={t("sidebar.introTitle")}
      introBody={t("sidebar.introBody")}
      highlights={t.raw("sidebar.highlights") as string[]}
      backLabel={t("sidebar.backToHome")}
    >
      <LoginForm />
      <p className="mt-4 text-center text-xs leading-6 text-[color:var(--foreground-muted)]">
        {t("loginHint")}
      </p>
      <p className="mt-5 text-center text-sm text-[color:var(--foreground-muted)]">
        {t("signupPrompt")}{" "}
        <Link href="/signup" className="font-semibold text-[color:var(--accent-strong)] hover:underline">
          {t("signupButtonLabel")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
