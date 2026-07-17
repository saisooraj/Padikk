import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getStatsData } from "@/lib/queries/stats";
import { StatsClient } from "./StatsClient";

export default async function StatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getStatsData(session.user.id);

  return <StatsClient data={data} />;
}
