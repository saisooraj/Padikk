import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getReviewData } from "@/lib/queries/review";
import { ReviewClient } from "./ReviewClient";

export default async function WeeklyReviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getReviewData(session.user.id);

  return <ReviewClient data={data} />;
}
