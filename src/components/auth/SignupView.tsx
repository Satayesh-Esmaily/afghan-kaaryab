import { getTranslations } from "next-intl/server";
import SignupForm from "@/components/auth/SignupForm";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { Link } from "@/i18n/navigation";

export default async function SignupView() {
  const t = await getTranslations("auth");

  return (
    <AuthPageShell
      title={t("signupTitle")}
      subtitle={t("signupSubtitle")}
      introEyebrow={t("sidebar.introEyebrow")}
      introTitle={t("sidebar.introTitle")}
      introBody={t("sidebar.introBody")}
      highlights={t.raw("sidebar.highlights") as string[]}
      backLabel={t("sidebar.backToHome")}
    >
      <SignupForm />
      <p className="mt-4 text-center text-xs leading-6 text-[color:var(--foreground-muted)]">
        {t("signupHint")}
      </p>
      <p className="mt-5 text-center text-sm text-[color:var(--foreground-muted)]">
        {t("loginPrompt")}{" "}
        <Link href="/login" className="font-semibold text-[color:var(--accent-strong)] hover:underline">
          {t("loginButtonLabel")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
