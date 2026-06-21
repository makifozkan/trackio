import { Project } from '@/app/lib/definitions';
import { MoreVert, Architecture } from '@mui/icons-material';
import Image from 'next/image';

export default function ProjectListTile({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-8 shadow-xs hover:shadow-md transition-shadow border-none group">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <Architecture />
      </div>
      <div className="flex-1 grid grid-cols-3 gap-8 items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Project Title
          </p>
          <h3 className="text-lg font-bold text-slate-900">{project.name || '-'}</h3>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Source Idea
          </p>
          <p className="text-slate-600 font-medium">{project.source_idea?.title || '-'}</p>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Overall Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-700 font-semibold text-sm">{project.status || '-'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
            <Image
              alt="avatar"
              className="w-full h-full object-cover"
              data-alt="portrait of a young woman professional against a neutral background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwiI-qwfy16T8LSrm8ICFFaGmOB-uRXenEUIcKTx2e1wSamXnhxt_DCanOhjfHSwfCrWPUua7mefL-rMcM4TELWma7C-wW5GMSiUADJRYSSGurug4Hnhjo3nmQTIaaKLFPIZyD2lKFICysALIHaA-NQRstc2d1PHzBgJ7hX6M7mrwxGAObgEURZCt1sPqweqM1aoQ2kbgtD4u9CkJlOwpGfpSU3AgQNYj4ekrkysNU5VhoFx7MOzD_9qWfD6CiwoAQzg9bNthDlQ"
            />
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
            <Image
              alt="sample"
              className="w-full h-full object-cover"
              data-alt="professional male portrait with natural lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWi4QVlq_gsmckVAJnO2XJXGsETUfPYjIuPHfJ5ZXm3tWuGwmFNG25BTbt67in2CS1tXY-Q4ta3A9KXvA9X0FEO89UAx9y-FlUnA9IluUAhE8Grhtna-0JWZKNm5dEcqnwIbpJAU2E0G-r2wjPrrs7Z61TWHf-r2Ejwx3snxNIgmDXTRw9Rshqoo2S1GIrSOJr4_7EaOoTwgyAooXJV5DW2HPIxGbqoGXewE_gGYsLIZaKK3DTtcR81riwJy_KdJoQNsJI1ZaTHA"
            />
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
          <MoreVert />
        </button>
      </div>
    </div>
  );
}
