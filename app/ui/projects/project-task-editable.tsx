import { Task } from "@/app/lib/definitions";
import { Cancel, CheckCircle, Delete, Expand, ExpandMore, Schedule } from "@mui/icons-material";
import { useState } from "react";

export default function ProjectTaskEditable({ task, cancelCallback, saveCallback, deleteCallback }: { task?: Partial<Task>; cancelCallback?: () => void; saveCallback?: (task: Partial<Task>) => void; deleteCallback?: (id: string) => void }) {
    const [name, setName] = useState(task?.name);
    const [category, setCategory] = useState(task?.category);
    const [duration, setDuration] = useState(task?.duration || 0);

    return <div className="relative">
        <div className="flex items-center gap-4 group">
            <div className="flex-1 bg-white border-2 border-sky-500/30 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button type="button" className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-400">
                        <ExpandMore className="text-slate-400 text-sm" />
                    </button>
                    <div className="flex-1 flex gap-3">
                        <input className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                        <div className="relative w-40">
                            <select className="w-full bg-none appearance-none bg-indigo-50 border-none rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-indigo-600 focus:ring-0 cursor-pointer" value={category} onChange={(event) => setCategory(event.target.value)}>
                                <option>Frontend</option>
                                <option>Security</option>
                                <option>Backend</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                <ExpandMore className="text-indigo-400 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between pl-10">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <Schedule className="text-xs" />
                            <input onChange={(event) => setDuration(Number(event.target.value))} className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-center focus:ring-1 focus:ring-sky-500" type="number" value={duration} />
                            <span>days</span>
                        </div>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">layers</span> {task?.sub_tasks?.length || 0} Sub-tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={() => cancelCallback && cancelCallback()} className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-sky-600 rounded-lg" title="Cancel"><Cancel className="material-symbols-outlined text-lg" /></button>
                        <button type="button" onClick={() => saveCallback && saveCallback({ id: task?.id, name, category, duration })} className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-sky-600 rounded-lg" title="Save Row"><CheckCircle className="material-symbols-outlined text-lg" /></button>
                        <button type="button" onClick={() => deleteCallback && deleteCallback(task?.id || "")} className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg" title="Delete"><Delete className="material-symbols-outlined text-lg" /></button>
                    </div>
                </div>
            </div>
        </div></div>;
}