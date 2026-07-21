"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mapSessionUserToAuthUser } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";
import { getDisplayName, type AuthUser } from "@/lib/app-state";

function getFriendlyAuthError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }

  if (message.includes("user already registered")) {
    return "This email is already registered. Please sign in instead.";
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (message.includes("signup disabled")) {
    return "Account creation is currently unavailable.";
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

export function useAuthState(initialUser: AuthUser | null, initialAuthReady: boolean, useServerBootstrap: boolean) {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [authReady, setAuthReady] = useState(() => initialAuthReady || !supabase);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    if (useServerBootstrap && initialAuthReady) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const sessionUser = session?.user;
        setUser(sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null);
        setAuthReady(true);
      });

      return () => {
        data.subscription.unsubscribe();
      };
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;

        const sessionUser = data.session?.user;
        setUser(sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null);
        setAuthReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setAuthReady(true);
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user;
      setUser(sessionUser?.email ? mapSessionUserToAuthUser(sessionUser) : null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [initialAuthReady, supabase, useServerBootstrap]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Authentication is temporarily unavailable.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(getFriendlyAuthError(error, "We could not sign you in."));
    }

    const signedInUser = data.session?.user ?? data.user;

    if (!signedInUser?.email) {
      throw new Error("Unable to sign in.");
    }

    setUser(mapSessionUserToAuthUser(signedInUser));
  }, []);

  const signup = useCallback(
    async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        throw new Error("Authentication is temporarily unavailable.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim() || getDisplayName(email),
          },
        },
      });

      if (error) {
        throw new Error(getFriendlyAuthError(error, "We could not create your account."));
      }

      const signedInUser = data.session?.user;

      if (!signedInUser?.email) {
        return { needsConfirmation: true };
      }

      setUser(mapSessionUserToAuthUser(signedInUser));
      return { needsConfirmation: false };
    },
    []
  );

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
  }, []);

  return useMemo(
    () => ({
      user,
      authenticated: Boolean(user),
      authReady,
      login,
      signup,
      logout,
      setUser,
    }),
    [authReady, login, logout, signup, user]
  );
}
