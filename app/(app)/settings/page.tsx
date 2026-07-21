import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getSettingsData } from "@/lib/queries/settings";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getSettingsData(session.user.id);

  return <SettingsClient data={data} />;
}
