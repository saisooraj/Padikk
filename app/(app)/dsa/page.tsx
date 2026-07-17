import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDsaData } from "@/lib/queries/dsa";
import { DsaClient } from "./DsaClient";

export default async function DsaTrackerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getDsaData(session.user.id);

  return <DsaClient data={data} />;
}
