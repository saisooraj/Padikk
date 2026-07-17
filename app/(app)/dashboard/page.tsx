import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDashboardData } from "@/lib/queries/dashboard";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getDashboardData(session.user.id);

  return <DashboardClient data={data} />;
}
