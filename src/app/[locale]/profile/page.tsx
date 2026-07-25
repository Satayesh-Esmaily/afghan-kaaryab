import type { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your job seeker profile on KaarYab Afghanistan.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
