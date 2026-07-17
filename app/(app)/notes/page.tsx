import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getNotesData } from "@/lib/queries/notes";
import { NotesClient } from "./NotesClient";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const data = await getNotesData(session.user.id);

  return <NotesClient data={data} />;
}
