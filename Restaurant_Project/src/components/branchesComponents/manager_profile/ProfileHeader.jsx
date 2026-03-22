import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ProfileHeader({ name, role, branch_id, status, lastActive }) {
    return (
        <div className="flex justify-between items-end">
            <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight text-slate-900">{name}</h2>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-amber-500 text-white border-none font-extrabold uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
                        {role}
                    </Badge>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">• ID: {branch_id?.substring(0, 8)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full bg-slate-50 border border-slate-100 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${status === 'On Duty' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                    {status}
                </span>
                <Separator orientation="vertical" className="h-3 bg-slate-200" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 pr-2">
                    {lastActive?.split(',')[0] || 'Never Checked-In'}
                </span>
            </div>
        </div>
    );
}
