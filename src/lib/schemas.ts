import { z } from "zod";
import type { ResumeTemplateId } from "@/context/app-context";
import { opportunityCategories, opportunityTypes } from "@/lib/opportunities";

const resumeTemplates = ["classic", "modern", "compact"] as const satisfies readonly ResumeTemplateId[];

const listText = z
  .string()
  .trim()
  .min(2, "Please add at least one item.")
  .refine((value) => value.length > 0, "This field is required.");

export const opportunityFormSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  organization: z.string().trim().min(2, "Organization is required."),
  category: z.enum(opportunityCategories),
  location: z.string().trim().min(2, "Location is required."),
  type: z.enum(opportunityTypes),
  deadline: z.string().min(1, "Deadline is required."),
  description: z
    .string()
    .trim()
    .min(25, "Description should be at least 25 characters."),
  requirementsText: listText,
  applyLink: z.string().url("Enter a valid apply link."),
  tagsText: z.string().trim().optional().default(""),
  featured: z.boolean().default(false),
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  subject: z.string().trim().min(3, "Subject is required."),
  message: z.string().trim().min(10, "Message should be at least 10 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required."),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;

const requiredText = z.string().trim().min(1, "This field is required.");

export const experienceEntrySchema = z.object({
  position: requiredText,
  organization: requiredText,
  employmentType: requiredText,
  currentlyWorking: z.boolean(),
  startDate: requiredText,
  endDate: z.string().trim(),
  country: requiredText,
  province: requiredText,
  skills: z.string().trim(),
  description: z.string().trim().min(10, "Description is required."),
});

export type ExperienceEntryFormValues = z.infer<typeof experienceEntrySchema>;

export const educationEntrySchema = z.object({
  degree: requiredText,
  institution: requiredText,
  fieldOfStudy: requiredText,
  country: requiredText,
  province: requiredText,
  startDate: requiredText,
  endDate: z.string().trim(),
  description: z.string().trim(),
});

export type EducationEntryFormValues = z.infer<typeof educationEntrySchema>;

export const certificationEntrySchema = z.object({
  title: requiredText,
  certificationUrl: z.string().trim(),
  credentialId: z.string().trim(),
  issuingOrganization: requiredText,
  issueDate: requiredText,
  expirationDate: z.string().trim(),
  description: z.string().trim().min(5, "Description is required."),
  attachmentUrl: z.string().trim().min(1, "Attachment is required."),
  attachmentStoragePath: z.string().trim().min(1, "Attachment is required."),
  attachmentFileName: z.string().trim().min(1, "Attachment is required."),
});

export type CertificationEntryFormValues = z.infer<typeof certificationEntrySchema>;

export const awardEntrySchema = z.object({
  title: requiredText,
  issuedBy: requiredText,
  date: requiredText,
  description: z.string().trim().min(5, "Description is required."),
  referenceUrl: z.string().trim(),
  attachmentUrl: z.string().trim().min(1, "Attachment is required."),
  attachmentStoragePath: z.string().trim().min(1, "Attachment is required."),
  attachmentFileName: z.string().trim().min(1, "Attachment is required."),
});

export type AwardEntryFormValues = z.infer<typeof awardEntrySchema>;

export const documentEntrySchema = z.object({
  title: requiredText,
  documentType: requiredText,
  description: z.string().trim(),
  attachmentUrl: z.string().trim().min(1, "Attachment is required."),
  attachmentStoragePath: z.string().trim().min(1, "Attachment is required."),
  attachmentFileName: z.string().trim().min(1, "Attachment is required."),
});

export type DocumentEntryFormValues = z.infer<typeof documentEntrySchema>;

export const profileFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  headline: z.string().trim().min(3, "Headline is required."),
  avatarUrl: z.string().trim(),
  resumeUrl: z.string().trim(),
  country: z.string().trim().min(2, "Country is required."),
  province: z.string().trim().min(2, "Province is required."),
  nationality: z.string().trim().min(2, "Nationality is required."),
  dateOfBirth: z.string().trim(),
  gender: z.string().trim().min(2, "Gender is required."),
  address: z.string().trim(),
  summary: z.string().trim().min(10, "Summary is required."),
  skills: z.string().trim().min(2, "Skills are required."),
  experience: z.string().trim(),
  education: z.string().trim(),
  certifications: z.string().trim(),
  awards: z.string().trim(),
  languages: z.string().trim().min(2, "Languages are required."),
  documents: z.string().trim(),
  portfolioUrl: z.string().trim(),
  linkedinUrl: z.string().trim(),
  githubUrl: z.string().trim(),
  twitterUrl: z.string().trim(),
  introVideoUrl: z.string().trim(),
  location: z.string().trim().min(2, "Location is required."),
  phone: z.string().trim(),
  bio: z.string().trim().min(10, "Bio is required."),
  resumeTemplate: z.enum(resumeTemplates),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
