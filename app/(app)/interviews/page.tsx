import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getInterviewsData } from "@/lib/queries/interviews";
import { InterviewsClient } from "./InterviewsClient";

export default async function InterviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getInterviewsData(session.user.id);

  return <InterviewsClient data={data} />;
}
