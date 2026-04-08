"use client";

import { Task } from "@/app/lib/definitions";
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
} from "@mui/icons-material";
import clsx from "clsx";
import { use, useCallback, useEffect, useState } from "react";
import { set } from "zod";
import ProjectTaskEditable from "./project-task-editable";

export default function ProjectTask({ task, saveTaskCallback, deleteTaskCallback }: { task?: Partial<Task>; subtasksChangedCallback?: (subtasks: Partial<Task>[]) => void; saveTaskCallback?: (task: Partial<Task>) => void; deleteTaskCallback?: (id: string) => void }) {
  const isRoot = true;
  const [subtasks, setSubtasks] = useState<Partial<Task>[]>(
    task?.sub_tasks || [],
  );
  const [isEditing, setIsEditing] = useState(false);

  const removeSubTask = (id: string) => {
    setSubtasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addSubTask = () => {
    setSubtasks((prev) => [...prev,
    {
      id: `task-${subtasks.length + 1}`,
      name: `New Task ${subtasks.length + 1}`,
      description: "",
    },]);

    setIsExpandedWrapper(true);
  };

  useEffect(() => {
    saveTaskCallback && saveTaskCallback({ id: task?.id, sub_tasks: subtasks });
  }, [subtasks]);


  const setIsExpandedWrapper = (expanded: boolean) => {
    saveTaskCallback && saveTaskCallback({ id: task?.id, is_expanded: expanded });
  }

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = useCallback((task: Partial<Task>) => {
    console.log("Saving task:", task);
    // Save logic here
    setSubtasks((prev) => {
      const index = prev.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        prev[index] = { ...prev[index], ...task };
      }
      return [...prev];
    });

    setIsEditing(false);
  }, [task]);

  const saveTaskCallbackWrapper = (task: Partial<Task>) => {
    saveTaskCallback && saveTaskCallback(task);
    setIsEditing(false);
  }

  return (
    <div className={clsx("space-y-6 relative", isRoot ? "" : "pl-6")}>
      {/* <!-- Root Node 1 --> */}
      <div className="relative">
        {isEditing ? (
          <ProjectTaskEditable task={task} cancelCallback={cancelEdit} saveCallback={saveTaskCallbackWrapper} deleteCallback={deleteTaskCallback} />
        ) : (
          <div className="flex items-center gap-4 group">
            <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                {task?.is_expanded ? (
                  <button
                    onClick={() => setIsExpandedWrapper(false)}
                    className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-400"
                  >
                    <ExpandMore className="text-slate-400 text-sm" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsExpandedWrapper(true)}
                    className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-400"
                  >
                    <ChevronRight className="text-sm" />
                  </button>
                )}
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    {task?.name || "--"}
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-50 text-indigo-600">
                      {task?.category || "Uncategorized"}
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
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg"
                  title="Edit Task"
                >
                  <Edit className="text-lg" />
                </button>
                <button
                  onClick={() => addSubTask()}
                  className="p-1.5 hover:bg-sky-50 text-sky-600 rounded-lg"
                  title="Add Sub-task"
                >
                  <AddCircle className="text-lg" />
                </button>
                <button
                  onClick={() => { }}
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg cursor-move"
                  title="Drag"
                >
                  <DragIndicator className="text-lg" />
                </button>
                <button
                  onClick={() => deleteTaskCallback && deleteTaskCallback(task?.id || "")}
                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                  title="Delete Task"
                >
                  <Delete className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <!-- Nested Sub-tasks --> */}
        {task?.is_expanded && (
          <div className="ml-10 mt-4 space-y-4">
            {subtasks.map((sub) => (
              <ProjectTask key={sub.id} task={sub} saveTaskCallback={saveEdit} deleteTaskCallback={removeSubTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
