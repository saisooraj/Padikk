import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getRoadmapData } from "@/lib/queries/roadmap";
import { RoadmapClient } from "./RoadmapClient";

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getRoadmapData(session.user.id);

  return <RoadmapClient data={data} />;
}
