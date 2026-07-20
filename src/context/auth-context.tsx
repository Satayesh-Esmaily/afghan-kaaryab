"use client";

import { createContext, useContext } from "react";
import type { AuthUser, ThemeMode } from "@/lib/app-state";

export type AuthContextValue = {
  user: AuthUser | null;
  authenticated: boolean;
  hydrated: boolean;
  authReady: boolean;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<{ needsConfirmation: boolean }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthContextProvider({
  value,
  children,
}: {
  value: AuthContextValue;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }

  return value;
}
