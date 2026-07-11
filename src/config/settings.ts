export const settingsCopy = {
  pageEyebrow: "Settings",
  pageTitle: "Tune your experience",
  pageDescription:
    "Manage the small details that make the platform feel more personal, clear, and ready for demo use.",
  preferencesBadge: "Preferences",
  preferencesTitle: "Appearance and notifications",
  preferencesBody: "Keep the interface clean, control updates, and make the demo easier to present.",
  currentModeLabel: "Current mode",
  currentModeValue: "Balanced",
  displayBadge: "Display",
  displayTitle: "Visual style",
  dataBadge: "Data",
  dataTitle: "Local demo controls",
  dataBody: "These actions are safe for the demo version and keep the experience simple.",
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
    description: "Allow your profile to be discoverable inside the demo platform.",
    checked: false,
  },
];

export const displayRows = [
  ["Theme", "Dark / Light toggle in the header"],
  ["Density", "Comfortable spacing"],
  ["Motion", "Soft transitions only"],
] as const;
