import countriesSource from "@dropdowns/countries/json/countries.json";
import nationalitiesSource from "@dropdowns/nationalities/json/nationalities.json";

export type SelectOption = {
  value: string;
  label: string;
};

const countryNames = countriesSource as Array<{ code?: string; name: string }>;
const nationalityNames = nationalitiesSource as Array<{ name: string }>;

export const genderOptions: SelectOption[] = [
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

export const nationalityOptions: SelectOption[] = nationalityNames
  .map((item) => ({
    value: item.name,
    label: item.name,
  }))
  .sort((left, right) => left.label.localeCompare(right.label));
