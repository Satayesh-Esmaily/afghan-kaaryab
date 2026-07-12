export const settingsCopy = {
  pageEyebrow: "Settings",
  pageTitle: "Tune your experience",
  pageDescription:
    "Manage the details that shape how KaarYab works for your job search and organization activity.",
  preferencesBadge: "Preferences",
  preferencesTitle: "Appearance and notifications",
  preferencesBody: "Keep the interface clean, control updates, and tailor the platform to your routine.",
  currentModeLabel: "Current mode",
  currentModeValue: "Balanced",
  displayBadge: "Display",
  displayTitle: "Visual style",
  dataBadge: "Data",
  dataTitle: "Data controls",
  dataBody: "These actions help you manage your saved opportunities and account data.",
  exportLabel: "Export local data",
  saveLabel: "Save settings",
};

export const preferenceRows = [
  {
    title: "Email notifications",
    description: "Receive occasional updates about saved opportunities and new listings.",
    checked: true,
  },
  {
    title: "Weekly summary",
    description: "Get a short recap of new items and deadline changes every week.",
    checked: false,
  },
  {
    title: "Public profile",
    description: "Allow your profile to be discoverable across the platform.",
    checked: false,
  },
];

export const displayRows = [
  ["Theme", "Dark / Light toggle in the header"],
  ["Density", "Comfortable spacing"],
  ["Motion", "Soft transitions only"],
] as const;
