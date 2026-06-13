'use client';

import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { CreateIdeaModal } from './create-idea-modal';

export function IdeasHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-8">
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    Ideas
                </h1>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Curated market hypotheses and emerging financial vectors for high-conviction strategies.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95"
            >
                <PlusCircleIcon className="h-5 w-5" />
                Add a new idea
            </button>

            <CreateIdeaModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}

