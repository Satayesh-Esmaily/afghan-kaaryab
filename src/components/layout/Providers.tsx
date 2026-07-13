"use client";

import { AppProvider } from "@/context/app-context";
import PwaRegistration from "@/components/layout/PwaRegistration";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <PwaRegistration />
      {children}
    </AppProvider>
  );
}
