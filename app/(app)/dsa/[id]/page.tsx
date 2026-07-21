import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDsaData } from "@/lib/queries/dsa";
import { DsaClient } from "../DsaClient";

export default async function DsaProblemPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getDsaData(session.user.id);
  if (!data.problems.some((p) => p.id === params.id)) notFound();

  return <DsaClient data={data} initialSelectedId={params.id} />;
}
