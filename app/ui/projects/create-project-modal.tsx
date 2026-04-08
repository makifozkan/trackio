import { ExpandMore, AccountTree, ChevronRight, SubdirectoryArrowRight, AddCircle, Layers, Schedule, Edit, Delete, DragIndicator } from "@mui/icons-material";
import ProjectTask from "./project-task";
import { Idea, Project, Task } from "@/app/lib/definitions";
import { useCallback, useEffect, useState } from "react";
import { fetchIdeas } from "@/app/lib/ideas-actions";
import { generateProjectPlan } from "@/app/lib/gemini-actions";
export default function CreateProjectModal({ project }: { project: Partial<Project> }) {
    const [tasks, setTasks] = useState<Partial<Task>[]>(project?.tasks || []);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const fetchIdeasWrapper = async () => {
        const ideas = await fetchIdeas();
        console.log("Fetched ideas:", ideas);
        setIdeas(ideas);
    }

    useEffect(() => {
        fetchIdeasWrapper();
    }, []);

    const addNewTask = () => {
        setTasks(prev => [
            ...prev,
            {
                id: `task-${prev.length + 1}`,
                name: `New Task ${prev.length + 1}`,
                description: '',
            }
        ]);
    };

    const autoGenerateHierarchy = async () => {
        const generatedTasks = await generateProjectPlan(project?.source_idea?.title || "");
        if (generatedTasks) {
            console.log("Generated tasks from Gemini:", generatedTasks);
            setTasks(generatedTasks);
        }
    };

    const removeSubTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const saveEdit = useCallback((task: Partial<Task>) => {
        console.log("Saving task:", task);
        // Save logic here
        setTasks((prev) => {
            const index = prev.findIndex((t) => t.id === task.id);
            if (index !== -1) {
                prev[index] = { ...prev[index], ...task };
            }
            return [...prev];
        });
    }, [project]);

    const calculateWorkingDays = (tasks: Partial<Task>[], sum: number): number => {
        if (tasks.length === 0) {
            return sum;
        }

        const currentTotal = tasks.reduce((total, task) => total + (task?.duration ?? 0), sum);
        const subTaskTotals = tasks.reduce((total, task) => total + calculateWorkingDays(task?.sub_tasks || [], 0), 0);
        return currentTotal + subTaskTotals;
    };

    return (
        <>
            {/* <!-- Scrollable Content --> */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 group">
                {/* <!-- Selection Section --> */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Select Idea</label>
                    <div className="relative group">
                        <select defaultValue={1} className="w-full bg-none appearance-none bg-slate-100 border-none rounded-xl px-4 py-3.5 font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20 cursor-pointer">
                            {ideas.map(idea => <option key={idea.id}>{idea.title}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 group-focus-within:rotate-180">
                            <ExpandMore className="text-slate-400" />
                        </div>
                    </div>
                </div>
                {/* <!-- Architectural Tree View --> */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Work Breakdown Structure</label>
                        <button onClick={autoGenerateHierarchy} className="text-sky-600 text-sm font-semibold hover:text-sky-700 flex items-center gap-1">
                            <AccountTree className="text-sm" />
                            Auto-generate Hierarchy
                        </button>
                    </div>
                    {/* <!-- The Tree --> */}
                    <div className="space-y-6 relative">
                        {tasks.map(task => <ProjectTask key={task.id} task={task} saveTaskCallback={saveEdit} deleteTaskCallback={removeSubTask} />)}
                        {/* <!-- Add Task Trigger --> */}
                        <button onClick={addNewTask} className="flex items-center gap-3 px-4 py-3 w-full border border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all font-medium text-sm group mt-6">
                            <AddCircle className="material-symbols-outlined group-hover:scale-110 transition-transform" />
                            Append New Primary Task
                        </button>
                    </div>
                </div>
                {/* <!-- Summary Widget --> */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-sky-700/50">Estimated Duration</p>
                        <p className="text-xl font-bold text-sky-900">{calculateWorkingDays(tasks, 0)} Working Days</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Intensity</p>
                        <p className="text-xl font-bold text-slate-800">High (3 Streams)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Count</p>
                        <p className="text-xl font-bold text-slate-800">{tasks.length} Deliverables</p>
                    </div>
                </div>
            </div>
            {/* <!-- Modal Footer --> */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
                <button className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 transition-colors">
                    Discard Draft
                </button>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2.5 font-bold text-sky-700 hover:bg-sky-100 rounded-lg transition-colors">
                        Save as Template
                    </button>
                    <button className="px-8 py-2.5 bg-sky-700 text-white font-bold rounded-lg shadow-lg shadow-sky-900/10 hover:bg-sky-800 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        Deploy Initiative
                    </button>
                </div>
            </div>
        </>
    );
}