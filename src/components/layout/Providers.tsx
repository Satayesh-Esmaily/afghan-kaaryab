"use client";

import { AppProvider } from "@/context/app-context";
import type { ServerBootstrapState } from "@/lib/bootstrap";

export default function Providers({
  children,
  bootstrap,
}: {
  children: React.ReactNode;
  bootstrap: ServerBootstrapState;
}) {
  return (
    <AppProvider bootstrap={bootstrap}>
      {children}
    </AppProvider>
  );
}
