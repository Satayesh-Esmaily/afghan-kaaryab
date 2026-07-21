import { getDisplayName, type AuthUser } from "@/lib/app-state";

export type SessionUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
  } | null;
};

export function mapSessionUserToAuthUser(sessionUser: SessionUserLike): AuthUser {
  const email = sessionUser.email ?? "";

  return {
    id: sessionUser.id,
    email,
    displayName:
      sessionUser.user_metadata?.full_name ??
      sessionUser.user_metadata?.name ??
      getDisplayName(email),
  };
}
