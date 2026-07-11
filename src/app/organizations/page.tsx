import type { Metadata } from "next";
import NetworkView from "@/components/network/NetworkView";
import { networkPageCopy } from "@/config/network";

export const metadata: Metadata = {
  title: networkPageCopy.title,
  description: networkPageCopy.description,
};

export default function OrganizationsPage() {
  return <NetworkView />;
}
