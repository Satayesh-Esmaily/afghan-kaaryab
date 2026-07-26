import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileView from "@/components/profile/ProfileView";

vi.mock("next/image", () => ({
  default: (props: { alt?: string }) => <span aria-label={props.alt ?? ""} />,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("status=welcome"),
}));

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
      avatarUrl: "",
      headline: "",
      country: "",
      province: "",
      nationality: "",
      gender: "",
      summary: "",
      skills: "React, TypeScript",
      languages: "Dari, English",
      bio: "",
      dateOfBirth: "",
      address: "",
      location: "",
      website: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      documents: "",
      experienceEntries: [],
      educationEntries: [],
      certificationEntries: [],
      awardEntries: [],
    },
  }),
}));

vi.mock("@/components/profile/profile-view/profile-view-helpers", () => ({
  getProfileCompletion: () => 73,
  getInitials: () => "AA",
  splitItems: (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  mapAwardEntryToForm: vi.fn(),
  mapCertificationEntryToForm: vi.fn(),
  mapDocumentEntryToForm: vi.fn(),
  mapEducationEntryToForm: vi.fn(),
  mapExperienceEntryToForm: vi.fn(),
}));

vi.mock("@/hooks/profile/useProfileForm", () => ({
  useProfileForm: () => ({
    register: () => ({}),
    handleSubmit: (fn: (values: unknown) => unknown) => (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      return fn({});
    },
    watch: () => "",
    setValue: vi.fn(),
    formState: { errors: {}, isSubmitting: false },
    onSubmit: vi.fn(),
  }),
}));

vi.mock("@/hooks/profile/useProfileActions", () => ({
  useProfileActions: () => ({
    experienceEntries: [],
    educationEntries: [],
    certificationEntries: [],
    awardEntries: [],
    documentEntries: [],
    editingExperienceIndex: null,
    editingEducationIndex: null,
    editingCertificationIndex: null,
    editingAwardIndex: null,
    editingDocumentIndex: null,
    setEditingExperienceIndex: vi.fn(),
    setEditingEducationIndex: vi.fn(),
    setEditingCertificationIndex: vi.fn(),
    setEditingAwardIndex: vi.fn(),
    setEditingDocumentIndex: vi.fn(),
    addExperience: vi.fn(),
    addEducation: vi.fn(),
    addCertification: vi.fn(),
    addAward: vi.fn(),
    addDocument: vi.fn(),
    deleteExperience: vi.fn(),
    deleteEducation: vi.fn(),
    deleteCertification: vi.fn(),
    deleteAward: vi.fn(),
    deleteDocument: vi.fn(),
    removeSkill: vi.fn(),
    removeLanguage: vi.fn(),
  }),
}));

vi.mock("@/hooks/profile/useProfileUpload", () => ({
  useProfileUpload: () => ({
    resumeFiles: [],
    resumeUploadBusy: false,
    resumeUploadError: "",
    uploadAvatar: vi.fn(),
    uploadResumeFiles: vi.fn(),
    deleteResume: vi.fn(),
    downloadResume: vi.fn(),
  }),
}));

vi.mock("@/components/profile/ProfileEntryDialog", () => ({
  ExperienceEntryDialog: () => null,
  EducationEntryDialog: () => null,
  CertificationEntryDialog: () => null,
  AwardEntryDialog: () => null,
  DocumentEntryDialog: () => null,
}));

vi.mock("@/components/profile/profile-view/ProfileHeader", () => ({
  ProfileHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/components/profile/profile-view/ProfileResumeSection", () => ({
  ProfileResumeSection: () => <section>resume-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileExperienceSection", () => ({
  ProfileExperienceSection: () => <section>experience-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileEducationSection", () => ({
  ProfileEducationSection: () => <section>education-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileCertificationSection", () => ({
  ProfileCertificationSection: () => <section>certification-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileAwardSection", () => ({
  ProfileAwardSection: () => <section>award-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileSkillsSection", () => ({
  ProfileSkillsSection: () => <section>skills-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileLinksSection", () => ({
  ProfileLinksSection: () => <section>links-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfileDocumentsSection", () => ({
  ProfileDocumentsSection: () => <section>documents-section</section>,
}));
vi.mock("@/components/profile/profile-view/ProfilePersonalDetailsSection", () => ({
  ProfilePersonalDetailsSection: () => <section>personal-details-section</section>,
}));

describe("ProfileView", () => {
  it("renders the profile shell and main sections", () => {
    render(<ProfileView />);

    expect(screen.getByText("pageTitle")).toBeInTheDocument();
    expect(screen.getByText("personal-details-section")).toBeInTheDocument();
    expect(screen.getByText("experience-section")).toBeInTheDocument();
    expect(screen.getByText("education-section")).toBeInTheDocument();
  });
});
