import "server-only";

import { cookies } from "next/headers";
import { parseThemeMode } from "@/lib/theme-preferences";

export async function getServerThemeMode() {
  const cookieStore = await cookies();
  return parseThemeMode(cookieStore.get("kaaryab-theme")?.value);
}
