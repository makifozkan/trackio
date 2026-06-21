'use client';

import { Task } from '@/app/lib/definitions';
import {
  AddCircle,
  ChevronRight,
  Delete,
  DragIndicator,
  Edit,
  ExpandMore,
  Layers,
  Schedule,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import clsx from 'clsx';
import { use, useCallback, useEffect, useState } from 'react';
import { set } from 'zod';
import ProjectTaskEditable from './project-task-editable';

export default function ProjectTask({
  task,
  saveTaskCallback,
  deleteTaskCallback,
}: {
  task?: Partial<Task>;
  subtasksChangedCallback?: (subtasks: Partial<Task>[]) => void;
  saveTaskCallback?: (task: Partial<Task>) => void;
  deleteTaskCallback?: (id: string) => void;
}) {
  const isRoot = true;
  const [subtasks, setSubtasks] = useState<Partial<Task>[]>(task?.sub_tasks || []);
  const [isEditing, setIsEditing] = useState(false);

  const removeSubTask = (id: string) => {
    setSubtasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addSubTask = () => {
    setSubtasks((prev) => [
      ...prev,
      {
        id: `task-${subtasks.length + 1}`,
        order: subtasks.length + 1,
        name: `New Task ${subtasks.length + 1}`,
        description: '',
      },
    ]);

    setIsExpandedWrapper(true);
  };

  useEffect(() => {
    saveTaskCallback && saveTaskCallback({ id: task?.id, sub_tasks: subtasks });
  }, [subtasks]);

  const setIsExpandedWrapper = (expanded: boolean) => {
    saveTaskCallback && saveTaskCallback({ id: task?.id, is_expanded: expanded });
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = useCallback(
    (task: Partial<Task>) => {
      console.log('Saving task:', task);
      // Save logic here
      setSubtasks((prev) => {
        const index = prev.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          prev[index] = { ...prev[index], ...task };
        }
        return [...prev];
      });

      setIsEditing(false);
    },
    [task]
  );

  const saveTaskCallbackWrapper = (task: Partial<Task>) => {
    saveTaskCallback && saveTaskCallback(task);
    setIsEditing(false);
  };

  return (
    <div className={clsx('space-y-6 relative', isRoot ? '' : 'pl-6')}>
      {/* <!-- Root Node 1 --> */}
      <div className="relative">
        {isEditing ? (
          <ProjectTaskEditable
            task={task}
            cancelCallback={cancelEdit}
            saveCallback={saveTaskCallbackWrapper}
            deleteCallback={deleteTaskCallback}
          />
        ) : (
          <div className="flex items-center gap-4 group">
            <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {task?.is_expanded ? (
                    <button
                      type="button"
                      onClick={() => setIsExpandedWrapper(false)}
                      className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-sm text-slate-400"
                    >
                      <ExpandMore className="text-slate-400 text-sm" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsExpandedWrapper(true)}
                      className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-sm text-slate-400"
                    >
                      <ChevronRight className="text-sm" />
                    </button>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {task?.name || '--'}
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase bg-indigo-50 text-indigo-600">
                        {task?.category || 'Uncategorized'}
                      </span>
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Schedule /> {task?.duration || 0} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers /> {subtasks.length} Sub-tasks
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg"
                    title="Edit Task"
                  >
                    <Edit className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addSubTask()}
                    className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg"
                    title="Add Sub-task"
                  >
                    <AddCircle className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg cursor-move"
                    title="Drag"
                  >
                    <DragIndicator className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTaskCallback && deleteTaskCallback(task?.id || '')}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                    title="Delete Task"
                  >
                    <Delete className="text-lg" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3 pt-3 border-t border-slate-50">
                <div className="md:col-span-8">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Description
                  </label>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task?.description || '-'}
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col justify-start">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Assigned To
                  </label>
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      alt="Member"
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOwHP9FBxlMvT_2eV2mwKpFSZ4kcJmeWkFbu0xAosGirjezHfmefvQUz-NSflglRes1hhxGjiTlcnN3auovaJDdBN55v8JInpu35rjXRNf6YLk4XYf0n-yAkn4zokMrbZGgw-eOKgN1ASwfmlzZlNn_hX_59hH3xQQhN3U1iou8mwE3tLgME8iZS5N_mdgiJ_Kt-gfA90Jcm_9wjCkHDfRSiEoJSPcYWWStFcg4fMRA7F_NpDTEFC6AOour64KdtcAlLb5KF8Qmw"
                    />
                    <img
                      alt="Member"
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDBCfeGjMvsCH9-B67-0aJnNvjP0QtvICNuky4SHTr-r-bBCIHN-6qAwi49HF9TTwQkQwEPNCs42kHYm156OlqZ6B24XdsAuKvjIX91h7Gk5LMHkjY2Qgn_L49ndQ52tBXcksJ2dprR8TDju6HvCb7vwYC-mwTXOqZpiIMdpdiQoW6DUVzqBeL9ed4rDB12vWIH61gkpqgBV2iEZpy9IYwU1eeEQIOmQguT-tAWEmdCGtJChdVmtUrKjtCJre9Eohv8TLtLgcf6A"
                    />
                    <button
                      type="button"
                      className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 hover:bg-sky-50 transition-colors"
                    >
                      +2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <!-- Nested Sub-tasks --> */}
        {task?.is_expanded && (
          <div className="ml-10 mt-4 space-y-4">
            {subtasks.map((sub) => (
              <ProjectTask
                key={sub.id}
                task={sub}
                saveTaskCallback={saveEdit}
                deleteTaskCallback={removeSubTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
