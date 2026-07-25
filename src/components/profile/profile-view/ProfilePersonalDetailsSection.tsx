"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import DatePickerField from "@/components/common/DatePickerField";
import FormField from "@/components/common/FormField";
import SearchableSelect from "@/components/common/SearchableSelect";
import { ProfileSection, ProfileValueBox } from "@/components/profile/profile-view/ProfileViewParts";
import type { SelectOption } from "@/data/profile-options";
import type { ProfileFormValues } from "@/lib/schemas";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

type ProfilePersonalDetailsSectionProps = {
  avatarInputRef: RefObject<HTMLInputElement | null>;
  avatarUrl: string;
  initials: string;
  completion: number;
  userEmail: string;
  errors: FieldErrors<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  setValue: UseFormSetValue<ProfileFormValues>;
  selectedCountry: string;
  selectedNationality: string;
  selectedGender: string;
  selectedDateOfBirth: string;
  countryOptions: SelectOption[];
  nationalityOptions: SelectOption[];
  genderOptions: SelectOption[];
  noMatchesLabel: string;
  onPickAvatar: () => void;
  onAvatarFileChange: (file: File | null) => void;
};

export function ProfilePersonalDetailsSection({
  avatarInputRef,
  avatarUrl,
  initials,
  completion,
  userEmail,
  errors,
  register,
  setValue,
  selectedCountry,
  selectedNationality,
  selectedGender,
  selectedDateOfBirth,
  countryOptions,
  nationalityOptions,
  genderOptions,
  noMatchesLabel,
  onPickAvatar,
  onAvatarFileChange,
}: ProfilePersonalDetailsSectionProps) {
  const t = useTranslations("profile.personal");
  const common = useTranslations("profile.common");

  return (
    <ProfileSection title={t("title")} description={t("description")}>
      <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-soft)] text-3xl font-semibold text-[color:var(--foreground-strong)]">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={t("profilePhotoAlt")} fill unoptimized sizes="80px" className="object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={onPickAvatar}
              className="ds-button-secondary rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              {t("uploadPhoto")}
            </button>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              onAvatarFileChange(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />

          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">{t("completionLabel")}</p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground-strong)]">{completion}%</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">{t("completionHint")}</p>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label={t("fullName")} error={errors.fullName?.message}>
              <input {...register("fullName")} className="ds-input" />
            </FormField>
            <FormField label={t("professionalExpertise")} error={errors.headline?.message}>
              <input {...register("headline")} className="ds-input" />
            </FormField>
            <FormField label={t("contactNumber")} error={errors.phone?.message}>
              <input {...register("phone")} className="ds-input" placeholder={t("phonePlaceholder")} />
            </FormField>
            <ProfileValueBox label={t("emailAddress")} value={userEmail || common("notAvailable")} />
            <FormField label={t("country")} error={errors.country?.message}>
              <SearchableSelect
                value={selectedCountry}
                options={countryOptions}
                placeholder={t("selectCountry")}
                searchPlaceholder={t("searchCountry")}
                noMatchesLabel={noMatchesLabel}
                onChange={(value) =>
                  setValue("country", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label={t("province")} error={errors.province?.message}>
              <input {...register("province")} className="ds-input" />
            </FormField>
            <FormField label={t("nationality")} error={errors.nationality?.message}>
              <SearchableSelect
                value={selectedNationality}
                options={nationalityOptions}
                placeholder={t("selectNationality")}
                searchPlaceholder={t("searchNationality")}
                noMatchesLabel={noMatchesLabel}
                onChange={(value) =>
                  setValue("nationality", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label={t("dateOfBirth")} error={errors.dateOfBirth?.message}>
              <DatePickerField
                key={selectedDateOfBirth || "empty-date-of-birth"}
                value={selectedDateOfBirth}
                placeholder={t("datePlaceholder")}
                onChange={(value) =>
                  setValue("dateOfBirth", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label={t("gender")} error={errors.gender?.message}>
              <SearchableSelect
                value={selectedGender}
                options={genderOptions}
                placeholder={t("selectGender")}
                noMatchesLabel={noMatchesLabel}
                onChange={(value) =>
                  setValue("gender", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label={t("currentAddress")} error={errors.address?.message}>
              <input {...register("address")} className="ds-input" placeholder={t("addressPlaceholder")} />
            </FormField>
            <FormField label={t("location")} error={errors.location?.message}>
              <input {...register("location")} className="ds-input" placeholder={t("locationPlaceholder")} />
            </FormField>
            <FormField label={t("avatarUrl")} error={errors.avatarUrl?.message}>
              <input {...register("avatarUrl")} className="ds-input" placeholder={t("avatarPlaceholder")} />
            </FormField>
          </div>

          <FormField label={t("summary")} error={errors.summary?.message}>
            <textarea
              {...register("summary")}
              className="ds-input min-h-32"
              placeholder={t("summaryPlaceholder")}
            />
          </FormField>
        </div>
      </div>
    </ProfileSection>
  );
}
