'use client';

import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import CreateProjectModal from './create-project-modal';
import Modal from '../common/modal';

export default function ProjectsHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-8">
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    Projects
                </h1>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Central hub for project management. Browse existing projects, create new ones, and monitor project status and milestones at a glance.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
            >
                <PlusCircleIcon className="h-5 w-5" />
                New Project
            </button>

            {/* <CreateProjectModal /> */}
            <Modal title='Create New Project' isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateProjectModal />
            </Modal>
        </div>
    );
}

