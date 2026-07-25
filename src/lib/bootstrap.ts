import type { AuthUser } from "@/lib/app-state";
import type { LoadedAppStore } from "@/lib/supabase-app-store";

export type ServerBootstrapState = {
  user: AuthUser | null;
  authReady: boolean;
  snapshot: LoadedAppStore;
  source: "server" | "fallback";
  prefetchedSnapshot: boolean;
};
