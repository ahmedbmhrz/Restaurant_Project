import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Navigation, MoreHorizontal } from "lucide-react"

export function ProfileStaffRoster({ staffCount, staffPreview, onJumpToBranch }) {
    return (
        <div className="col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Roster ({staffCount})
                </h3>
                <button 
                    onClick={onJumpToBranch}
                    className="h-7 px-3 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                    <Navigation className="h-2.5 w-2.5 fill-current" />
                    Jump to Branch
                </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {staffPreview?.map((staff) => (
                    <div key={staff.id} className="group/item flex items-center gap-3 bg-slate-50/30 p-3 rounded-2xl border border-transparent hover:border-amber-500/15 hover:bg-white hover:shadow-lg transition-all">
                        <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarImage src={staff.avatar_url} />
                            <AvatarFallback className="text-[10px] font-black bg-slate-100 text-slate-500">
                                {staff.full_name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="text-[11px] font-black text-slate-800 tracking-tight">{staff.full_name}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{staff.role}</div>
                        </div>
                        <div className="opacity-0 group-hover/item:opacity-100">
                            <MoreHorizontal className="h-3 w-3 text-slate-300" />
                        </div>
                    </div>
                ))}
                {staffCount > 4 && (
                    <div className="py-2 text-center rounded-xl bg-slate-50/50 border border-dashed text-[8px] font-black uppercase text-slate-300 tracking-[0.2em]">
                        + {staffCount - 4} Others
                    </div>
                )}
            </div>
        </div>
    );
}
