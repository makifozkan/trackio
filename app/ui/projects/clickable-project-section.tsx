'use client';

import Link from 'next/link';
import ProjectListTile from './project-list-tile';
import { useContext, useEffect, useState } from 'react';
import { Project } from '@/app/lib/definitions';
import Modal from '@/app/ui/common/modal';
import { ProjectDetailSkeleton } from '../skeletons';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProjectPageContext } from '@/app/dashboard/projects/project-page-context';

export default function ClickableProjectTile({ project }: { project: Project }) {
  const context = useContext(ProjectPageContext);
  const params = useSearchParams();
  const projectId = params.get('projectId');

  const handleLoading = () => {
    context.setLoading?.(true);
  };

  // useEffect(() => {
  //   console.log("ClickableProjectTile rendering...", projectId);

  //   if (projectId) {
  //     context.setLoading?.(false);
  //   }
  // }, [projectId]);

  return (
    <>
      <Link
        onClick={() => handleLoading()}
        key={project.id}
        href={`/dashboard/projects?projectId=${project.id}`}
      >
        <ProjectListTile project={project} />
      </Link>
    </>
  );
}
