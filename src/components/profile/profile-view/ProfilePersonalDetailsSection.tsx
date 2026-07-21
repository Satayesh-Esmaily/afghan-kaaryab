"use client";

import Image from "next/image";
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
  onPickAvatar,
  onAvatarFileChange,
}: ProfilePersonalDetailsSectionProps) {
  return (
    <ProfileSection title="Personal Details" description="Share your expertise and complete your profile.">
      <div className="grid gap-8 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-soft)] text-3xl font-semibold text-[color:var(--foreground-strong)]">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile photo" fill unoptimized sizes="80px" className="object-cover" />
              ) : (
                initials
              )}
            </div>
            <button type="button" onClick={onPickAvatar} className="ds-button-secondary rounded-full px-4 py-2.5 text-sm font-semibold">
              Upload Photo
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
              Profile completion
            </p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground-strong)]">{completion}%</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">
              Fill the sections below to make your profile stronger for employers.
            </p>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Full Name" error={errors.fullName?.message}>
              <input {...register("fullName")} className="ds-input" />
            </FormField>
            <FormField label="Professional Expertise" error={errors.headline?.message}>
              <input {...register("headline")} className="ds-input" />
            </FormField>
            <FormField label="Contact Number" error={errors.phone?.message}>
              <input {...register("phone")} className="ds-input" placeholder="+93 79 123 4567" />
            </FormField>
            <ProfileValueBox label="Email Address" value={userEmail || "Not available"} />
            <FormField label="Country" error={errors.country?.message}>
              <SearchableSelect
                value={selectedCountry}
                options={countryOptions}
                placeholder="Select country"
                searchPlaceholder="Search country..."
                onChange={(value) =>
                  setValue("country", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label="Province" error={errors.province?.message}>
              <input {...register("province")} className="ds-input" />
            </FormField>
            <FormField label="Nationality" error={errors.nationality?.message}>
              <SearchableSelect
                value={selectedNationality}
                options={nationalityOptions}
                placeholder="Select nationality"
                searchPlaceholder="Search nationality..."
                onChange={(value) =>
                  setValue("nationality", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
            <DatePickerField
              key={selectedDateOfBirth || "empty-date-of-birth"}
              value={selectedDateOfBirth}
              placeholder="Select date"
              onChange={(value) =>
                  setValue("dateOfBirth", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label="Gender" error={errors.gender?.message}>
              <SearchableSelect
                value={selectedGender}
                options={genderOptions}
                placeholder="Select gender"
                onChange={(value) =>
                  setValue("gender", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </FormField>
            <FormField label="Current Address" error={errors.address?.message}>
              <input {...register("address")} className="ds-input" placeholder="Taimani, Kabul, Afghanistan" />
            </FormField>
            <FormField label="Location" error={errors.location?.message}>
              <input {...register("location")} className="ds-input" placeholder="Kabul" />
            </FormField>
            <FormField label="Avatar URL" error={errors.avatarUrl?.message}>
              <input {...register("avatarUrl")} className="ds-input" placeholder="https://..." />
            </FormField>
          </div>

          <FormField label="Professional Summary" error={errors.summary?.message}>
            <textarea
              {...register("summary")}
              className="ds-input min-h-32"
              placeholder="Introduce your background, experience, and strengths."
            />
          </FormField>
        </div>
      </div>
    </ProfileSection>
  );
}
