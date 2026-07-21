"use client";

import { ProfileViewHeader } from "@/components/profile/profile-view/ProfileViewHeader";

type ProfileHeaderProps = {
  showWelcome: boolean;
  signupSuccessTitle: string;
  signupSuccessMessage: string;
  title: string;
};

export function ProfileHeader({
  showWelcome,
  signupSuccessTitle,
  signupSuccessMessage,
  title,
}: ProfileHeaderProps) {
  return (
    <ProfileViewHeader
      showWelcome={showWelcome}
      signupSuccessTitle={signupSuccessTitle}
      signupSuccessMessage={signupSuccessMessage}
      title={title}
    />
  );
}
