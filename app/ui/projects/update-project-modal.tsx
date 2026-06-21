'use server';

import { fetchIdeas } from '@/app/lib/ideas-actions';
import { fetchProjectById } from '@/app/lib/project-actions';
import CreateProjectModal from './create-project-modal';

export default async function UpdateProjectModal({ projectId }: { projectId: string }) {
  const [project, ideas] = await Promise.all([fetchProjectById(projectId), fetchIdeas()]);

  return <CreateProjectModal project={project} ideas={ideas} />;
}
