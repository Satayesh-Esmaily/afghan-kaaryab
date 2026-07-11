import { z } from "zod";
import { opportunityCategories, opportunityTypes } from "@/lib/opportunities";

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
