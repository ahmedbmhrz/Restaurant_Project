import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    Mail, 
    Phone, 
    TrendingUp, 
    Users, 
    Calendar, 
    Activity,
    Target,
    Briefcase,
    ShieldCheck
} from "lucide-react"

export function ManagerProfileModal({ manager, isOpen, onOpenChange, onJumpToBranch }) {
    if (!manager) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-white rounded-[2rem] shadow-2xl">
                {/* Banner with subtle gradient */}
                <div className="relative h-40 bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <ShieldCheck className="h-32 w-32 text-amber-500/30 -rotate-12" />
                    </div>
                    
                    {/* Floating Avatar */}
                    <div className="absolute -bottom-14 left-10 border-[6px] border-white rounded-[2.5rem] shadow-xl overflow-hidden bg-white">
                        <Avatar className="h-28 w-28 rounded-[2rem]">
                            <AvatarImage src={manager.avatarSrc} className="object-cover" />
                            <AvatarFallback className="text-3xl font-black bg-amber-500/10 text-amber-600">
                                {manager.avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="px-10 pt-20 pb-10 space-y-8">
                    {/* Header Info */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">{manager.name}</h2>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-none font-black uppercase tracking-widest text-[10px] px-3">
                                    {manager.role}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• Branch ID: {manager.branch_id?.substring(0, 8)}</span>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-primary cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-slate-100"><Mail className="h-3.5 w-3.5" /></div>
                                    {manager.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-primary cursor-pointer">
                                    <div className="p-1.5 rounded-lg bg-slate-100"><Phone className="h-3.5 w-3.5" /></div>
                                    {manager.phone}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant={manager.status === 'On Duty' ? 'success' : 'secondary'} className="rounded-2xl px-5 py-2 font-black uppercase tracking-widest text-[10px] shadow-sm">
                                <div className={`h-2 w-2 rounded-full mr-2 animate-pulse ${manager.status === 'On Duty' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {manager.status}
                            </Badge>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Last Active: {manager.lastActive?.split(',')[0]}</span>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="group relative bg-slate-50 p-5 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600"><TrendingUp className="h-4 w-4" /></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Growth</span>
                            </div>
                            <div className="text-2xl font-black text-emerald-600">{manager.growth}</div>
                            <div className="mt-1 text-[10px] font-bold text-muted-foreground">MoM Performance</div>
                        </div>

                        <div className="group relative bg-slate-50 p-5 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600"><Target className="h-4 w-4" /></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">KPI Score</span>
                            </div>
                            <div className="text-2xl font-black text-slate-800">{manager.performance}</div>
                            <div className="mt-1 text-[10px] font-bold text-muted-foreground">Efficiency Rating</div>
                        </div>

                        <div className="group relative bg-slate-50 p-5 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600"><Briefcase className="h-4 w-4" /></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Tenure</span>
                            </div>
                            <div className="text-2xl font-black text-slate-800">{manager.tenure}</div>
                            <div className="mt-1 text-[10px] font-bold text-muted-foreground">Loyalty Status</div>
                        </div>
                    </div>

                    {/* Staff & Revenue History */}
                    <div className="grid grid-cols-2 gap-10">
                        {/* Staff List */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Active Reports ({manager.staffCount})
                                </h3>
                                <button 
                                    onClick={onJumpToBranch}
                                    className="text-[10px] font-black uppercase text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    Jump to Branch
                                </button>
                            </div>
                            <div className="space-y-3">
                                {manager.staffPreview?.map((staff) => (
                                    <div key={staff.id} className="group/item flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 hover:border-amber-500/30 transition-all duration-300">
                                        <Avatar className="h-9 w-9 rounded-xl border border-slate-50">
                                            <AvatarImage src={staff.avatar_url} />
                                            <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-500">
                                                {staff.full_name?.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold leading-none text-slate-800">{staff.full_name}</div>
                                            <div className="text-[9px] font-medium text-slate-400 uppercase mt-1 tracking-wider">{staff.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Trend */}
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Revenue Trend (5mo)
                            </h3>
                            <div className="h-36 flex items-end gap-2 bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                                {manager.revenueHistory?.map((val, i) => (
                                    <div 
                                        key={i}
                                        className="flex-1 bg-amber-500/20 rounded-t-xl transition-all duration-500 hover:bg-amber-500/40 relative group cursor-help"
                                        style={{ height: `${(val / Math.max(...manager.revenueHistory)) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 backdrop-blur-sm">
                                            ${val.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
