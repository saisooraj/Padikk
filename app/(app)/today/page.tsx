import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getTodayData } from "@/lib/queries/today";
import { TodayClient } from "./TodayClient";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getTodayData(session.user.id);

  return <TodayClient data={data} />;
}
