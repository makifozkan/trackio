import { Project } from '@/app/lib/definitions';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Architecture } from '@mui/icons-material'
export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="bg-white rounded-2xl p-6 flex items-center gap-8 shadow-xs hover:shadow-md transition-shadow border-none group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Architecture />
            </div>
            <div className="flex-1 grid md:grid-cols-3 gap-8 items-center">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Project Title</p>
                    <h3 className="text-lg font-bold text-slate-900">{project.name || '-'}</h3>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Source Idea</p>
                    <p className="text-slate-600 font-medium">{project.source_idea?.title || '-'}</p>
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-700 font-semibold text-sm">{project.status || '-'}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {
                        project.team_members?.map((team_member) => (
                            <div className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                                <img className="w-full h-full object-cover" data-alt="portrait of a young woman professional against a neutral background" src={team_member.image} />
                            </div>
                        ))
                    }
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}