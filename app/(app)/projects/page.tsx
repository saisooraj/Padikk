import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getOrCreateProjects } from "@/lib/queries/projects";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const projects = await getOrCreateProjects(session.user.id);

  return <ProjectsClient projects={projects} />;
}
