import { getOrCreateUserSettings } from "@/lib/queries/dashboard";

export async function getSettingsData(userId: string) {
  const settings = await getOrCreateUserSettings(userId);
  return { settings };
}

export type SettingsData = Awaited<ReturnType<typeof getSettingsData>>;
