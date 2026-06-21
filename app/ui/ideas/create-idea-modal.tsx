'use client';

import {
  XMarkIcon,
  PlusIcon,
  TagIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { createIdea } from '@/app/lib/ideas-actions';
import { useActionState } from 'react';

interface CreateIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIdeaModal({ isOpen, onClose }: CreateIdeaModalProps) {
  const initialState = { message: '', errors: {} };
  const [state, formAction] = useActionState(createIdea, initialState);
  const [status, setStatus] = useState('High Potential');

  if (!isOpen) return null;

  const statuses = ['High Potential', 'Active Test', 'Paused', 'High Alpha'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity md:block hidden"
        onClick={onClose}
      />

      {/* Modal Content */}
      <form
        action={formAction}
        className={clsx(
          'relative z-10 flex h-full w-full flex-col bg-white shadow-2xl transition-all',
          'md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Create New Idea</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4 text-indigo-600" />
              Idea Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Decentralized Finance for SMEs"
              className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
            />
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2"
            >
              <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Briefly describe the market observation or potential pivot..."
              className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-gray-400 resize-none"
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Status Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Status
            </label>
            <input type="hidden" name="status" value={status} />
            <div className="grid grid-cols-2 gap-3">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={clsx(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all border',
                    status === s
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                      : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                  )}
                >
                  {s}
                  {status === s && <CheckIcon className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label
              htmlFor="keywords"
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2"
            >
              <TagIcon className="h-4 w-4 text-indigo-600" />
              Keywords (comma separated)
            </label>
            <input
              id="keywords"
              name="keywords"
              type="text"
              placeholder="AI, Risk Mgmt, Big Data"
              className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-6 md:flex-row md:justify-end md:gap-4 bg-gray-50/30 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors md:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-indigo-200 shadow-lg hover:bg-indigo-500 transition-all active:scale-95 md:w-auto"
          >
            Create Idea
          </button>
        </div>
      </form>
    </div>
  );
}
