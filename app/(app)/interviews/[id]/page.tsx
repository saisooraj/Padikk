import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getInterviewsData } from "@/lib/queries/interviews";
import { InterviewsClient } from "../InterviewsClient";

export default async function InterviewPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getInterviewsData(session.user.id);
  if (!data.interviews.some((iv) => iv.id === params.id)) notFound();

  return <InterviewsClient data={data} initialSelectedId={params.id} />;
}
