import { getTranslations } from "next-intl/server";

export default async function ContactDetailsCard() {
  const t = await getTranslations("contact");

  return (
    <div className="ds-card space-y-4 rounded-[1.5rem] p-6">
      <h2 className="ds-title text-xl font-semibold">{t("detailsTitle")}</h2>
      <p className="ds-muted text-sm leading-7">{t("detailsDescription")}</p>
      <div className="space-y-3 text-sm text-[color:var(--foreground)]">
        <p>
          {t("emailLabel")}: {t("email")}
        </p>
        <p>
          {t("locationLabel")}: {t("location")}
        </p>
        <p>
          {t("purposeLabel")}: {t("purpose")}
        </p>
      </div>
    </div>
  );
}
