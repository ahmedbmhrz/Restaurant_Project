import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Mail, 
    Phone, 
    TrendingUp, 
    Users, 
    Calendar, 
    Activity,
    Target,
    Briefcase,
    ShieldCheck,
    Navigation,
    MoreHorizontal
} from "lucide-react"

export function ManagerProfileModal({ manager, isOpen, onOpenChange, onJumpToBranch }) {
    if (!manager) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent 
                className="p-0 border-none bg-white rounded-[2rem] shadow-2xl transition-all duration-500 overflow-hidden" 
                style={{ width: '85vw', maxWidth: '950px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* Compact Content Wrapper */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Compact Banner */}
                    <div className="relative h-32 bg-linear-to-br from-amber-500/15 via-orange-500/5 to-transparent">
                        <div className="absolute top-4 right-8 opacity-5 scale-125">
                            <ShieldCheck className="h-32 w-32 text-amber-600" />
                        </div>
                        
                        {/* Smaller Bordered Avatar */}
                        <div className="absolute -bottom-12 left-10 p-1 bg-white rounded-[2rem] shadow-xl overflow-hidden ring-4 ring-white">
                            <Avatar className="h-24 w-24 rounded-[1.75rem] shadow-inner">
                                <AvatarImage src={manager.avatarSrc} className="object-cover" />
                                <AvatarFallback className="text-3xl font-black bg-amber-500/10 text-amber-600">
                                    {manager.avatarFallback}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="absolute top-4 left-10 flex gap-2">
                             <Badge variant="outline" className="bg-white/60 backdrop-blur-md border-white/40 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 text-slate-700">
                                Verified Profile
                             </Badge>
                        </div>
                    </div>

                    <div className="px-10 pt-16 pb-8 space-y-8">
                        {/* Identity & Status Row */}
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black tracking-tight text-slate-900">{manager.name}</h2>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-amber-500 text-white border-none font-extrabold uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
                                        {manager.role}
                                    </Badge>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">• ID: {manager.branch_id?.substring(0, 8)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full bg-slate-50 border border-slate-100 mb-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${manager.status === 'On Duty' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                                    {manager.status}
                                </span>
                                <Separator orientation="vertical" className="h-3 bg-slate-200" />
                                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 pr-2">
                                    {manager.lastActive?.split(',')[0] || 'Never Checked-In'}
                                </span>
                            </div>
                        </div>

                        {/* Compact Contact Bar */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50/40 p-3 rounded-2xl border border-dashed border-slate-200/60 w-full">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 hover:text-amber-600 cursor-pointer overflow-hidden truncate">
                                <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 shrink-0"><Mail className="h-3.5 w-3.5" /></div>
                                <span className="truncate">{manager.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 hover:text-amber-600 cursor-pointer shrink-0">
                                <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100"><Phone className="h-3.5 w-3.5" /></div>
                                {manager.phone}
                            </div>
                        </div>

                        {/* More Compact KPI Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'Growth', val: manager.growth, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                                { label: 'KPI Score', val: manager.performance, icon: Target, color: 'text-blue-600', bg: 'bg-blue-500/10' },
                                { label: 'Tenure', val: manager.tenure, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-500/10' }
                            ].map((kpi, i) => (
                                <div key={i} className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/60 hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}><kpi.icon className="h-3.5 w-3.5" /></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400/80">{kpi.label}</span>
                                    </div>
                                    <div className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</div>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-slate-100" />

                        {/* Balanced Compact Grid (Staff & Trends) */}
                        <div className="grid grid-cols-12 gap-8">
                            {/* Compact Roster */}
                            <div className="col-span-5 space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Users className="h-3.5 w-3.5" /> Roster ({manager.staffCount})
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
                                    {manager.staffPreview?.map((staff) => (
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
                                    {manager.staffCount > 4 && (
                                        <div className="py-2 text-center rounded-xl bg-slate-50/50 border border-dashed text-[8px] font-black uppercase text-slate-300 tracking-[0.2em]">
                                            + {manager.staffCount - 4} Others
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Compact Revenue History */}
                            <div className="col-span-7 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Activity className="h-3.5 w-3.5" /> Revenue (5MO)
                                </h3>
                                <div className="relative group bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 h-[200px] flex flex-col justify-between overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-2xl font-black text-slate-800 tracking-tighter">${manager.revenueHistory?.[4]?.toLocaleString()}</div>
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">This Month's Earnings</div>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px]">
                                            {manager.growth}
                                        </Badge>
                                    </div>

                                    {/* Compact Bar Chart */}
                                    <div className="h-20 flex items-end gap-2.5 mt-4">
                                        {(manager.revenueHistory || [0,0,0,0,0]).map((val, i) => (
                                            <div key={i} className="flex-1 group/bar relative h-full flex items-end justify-center">
                                                <div 
                                                    className="w-full bg-amber-500/15 rounded-lg transition-all duration-300 group-hover/bar:bg-amber-500 cursor-pointer"
                                                    style={{ height: `${(val / (Math.max(...manager.revenueHistory) || 1)) * 100}%` }}
                                                />
                                                <span className="absolute -bottom-5 text-[7px] font-black uppercase text-slate-300 tracking-widest opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY'][i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {!manager.revenueHistory?.length && (
                                        <div className="absolute inset-0 flex items-center justify-center italic text-slate-300 text-[10px] p-6 text-center">
                                            No revenue data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
