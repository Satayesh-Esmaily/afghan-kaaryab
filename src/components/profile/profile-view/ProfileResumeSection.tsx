"use client";

import type { ComponentProps } from "react";
import { ResumeTab } from "@/components/profile/profile-view/ProfileViewParts";

type ProfileResumeSectionProps = ComponentProps<typeof ResumeTab>;

export function ProfileResumeSection(props: ProfileResumeSectionProps) {
  return <ResumeTab {...props} />;
}
