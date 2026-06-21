'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Modal from '@/app/ui/common/modal';
import { ProjectDetailSkeleton } from '../skeletons';
import { ProjectPageContext } from '@/app/dashboard/projects/project-page-context';

export default function ProjectClientLoading() {
  const context = useContext(ProjectPageContext);

  return (
    <>
      {context.loading && (
        <Modal title="Update Project" isOpen={true}>
          <ProjectDetailSkeleton />
        </Modal>
      )}
    </>
  );
}
