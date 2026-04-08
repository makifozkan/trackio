import { Delete, Edit, SubdirectoryArrowRight } from "@mui/icons-material";

export default function ProjectLeafTask() {
    return (<div className="relative tree-line tree-line-node">
        <div className="flex items-center gap-4 group">
            <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex items-center justify-between hover:bg-white hover:border-sky-100 transition-colors">
                <div className="flex items-center gap-3">
                    <SubdirectoryArrowRight className="text-slate-300 text-sm" />
                    <div>
                        <h5 className="text-sm font-semibold text-slate-700">Formal Verification Repos</h5>
                        <span className="text-[10px] font-bold text-slate-400">Effort: 1 day</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-sky-600 text-slate-400 rounded transition-colors" title="Edit Sub-task"><Edit className="text-base" /></button>
                    <button className="p-1 hover:text-red-500 text-slate-400 rounded transition-colors" title="Delete Sub-task"><Delete className="text-base" /></button>
                </div>
            </div>
        </div>
    </div>);
}