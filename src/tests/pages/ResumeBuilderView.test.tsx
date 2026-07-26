import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResumeBuilderView from "@/components/profile/ResumeBuilderView";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/context/auth-context", () => ({
  useAuthContext: () => ({
    authenticated: true,
    user: { email: "amina@example.com" },
  }),
}));

vi.mock("@/context/profile-context", () => ({
  useProfileContext: () => ({
    profile: {
      fullName: "Amina",
      headline: "",
      country: "",
      province: "",
      nationality: "",
      gender: "",
      summary: "",
      skills: "React, TypeScript",
      documents: "",
      resumeTemplate: "modern",
      resumeStoragePath: "",
      resumeUrl: "",
      documentEntries: [],
      experienceEntries: [],
      educationEntries: [],
      certificationEntries: [],
      awardEntries: [],
      bio: "",
      dateOfBirth: "",
      address: "",
      location: "",
      website: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
    },
    updateProfile: vi.fn(),
  }),
}));

vi.mock("@/context/theme-context", () => ({
  useThemeContext: () => ({
    theme: "light",
  }),
}));

vi.mock("@/lib/resume-storage", () => ({
  getResumeAccessUrl: vi.fn(),
}));

vi.mock("@/components/profile/profile-view/profile-view-helpers", () => ({
  getProfileCompletion: () => 73,
  formatDateRangeLocalized: () => "Jan 2024 - Present",
  splitItems: (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
}));

describe("ResumeBuilderView", () => {
  it("renders the resume builder controls and preview", () => {
    render(<ResumeBuilderView />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("chooseTemplate")).toBeInTheDocument();
    expect(screen.getByText("downloadPdf")).toBeInTheDocument();
  });
});
