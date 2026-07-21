import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import AppShellClient from "@/components/layout/AppShellClient";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppShellClient footer={<Footer />}>
      {children}
    </AppShellClient>
  );
}
