import countriesSource from "@dropdowns/countries/json/countries.json";
import nationalitiesSource from "@dropdowns/nationalities/json/nationalities.json";

export type SelectOption = {
  value: string;
  label: string;
};

const countryNames = countriesSource as Array<{ code?: string; name: string }>;
const nationalityNames = nationalitiesSource as Array<{ name: string }>;

const genderOptionsBase: SelectOption[] = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

export const countryOptions: SelectOption[] = countryNames
  .map((item) => ({
    value: item.name,
    label: item.name,
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export function createLocalizedCountryOptions(locale: string): SelectOption[] {
  const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames([locale], { type: "region" }) : null;

  return countryNames
    .map((item) => ({
      value: item.name,
      label: item.code ? regionNames?.of(item.code) ?? item.name : item.name,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, locale));
}

export function createLocalizedGenderOptions(getLabel: (key: "female" | "male" | "preferNotToSay") => string): SelectOption[] {
  return genderOptionsBase.map((option) => {
    if (option.value === "Female") {
      return { value: option.value, label: getLabel("female") };
    }

    if (option.value === "Male") {
      return { value: option.value, label: getLabel("male") };
    }

    return { value: option.value, label: getLabel("preferNotToSay") };
  });
}

export const nationalityOptions: SelectOption[] = nationalityNames
  .map((item) => ({
    value: item.name,
    label: item.name,
  }))
  .sort((left, right) => left.label.localeCompare(right.label));
