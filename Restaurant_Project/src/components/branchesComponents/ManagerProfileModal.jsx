import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
    MapPin,
    ArrowUpRight,
    Target
} from "lucide-react"

export function ManagerProfileModal({ manager, isOpen, onOpenChange }) {
    if (!manager) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-slate-50/50 backdrop-blur-xl">
                <div className="relative h-32 bg-linear-to-r from-primary/80 to-primary shadow-inner">
                    <div className="absolute -bottom-12 left-8 border-4 border-background rounded-3xl overflow-hidden bg-background shadow-xl">
                        <Avatar className="h-24 w-24 rounded-2xl">
                            <AvatarImage src={manager.avatarSrc} className="object-cover" />
                            <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                                {manager.avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="px-8 pt-16 pb-8 space-y-8">
                    {/* Header Info */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">{manager.name}</h2>
                            <p className="text-sm font-bold text-primary/60 uppercase tracking-widest mt-1">{manager.role}</p>
                            
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5" /> {manager.email}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" /> {manager.phone}
                                </div>
                            </div>
                        </div>
                        <Badge variant={manager.status === 'On Duty' ? 'success' : 'secondary'} className="rounded-full px-4 py-1 font-black uppercase tracking-tighter text-[10px]">
                            {manager.status}
                        </Badge>
                    </div>

                    <Separator className="bg-primary/5" />

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/60 p-4 rounded-3xl border border-white/40 shadow-sm space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Growth</span>
                            </div>
                            <div className="text-xl font-black text-emerald-600">{manager.growth}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/60">Target: +12%</div>
                        </div>

                        <div className="bg-white/60 p-4 rounded-3xl border border-white/40 shadow-sm space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <Target className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">KPI Score</span>
                            </div>
                            <div className="text-xl font-black">{manager.performance}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/60">Efficiency Rating</div>
                        </div>

                        <div className="bg-white/60 p-4 rounded-3xl border border-white/40 shadow-sm space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Tenure</span>
                            </div>
                            <div className="text-xl font-black">{manager.tenure}</div>
                            <div className="text-[10px] font-bold text-muted-foreground/60">At this location</div>
                        </div>
                    </div>

                    {/* Staff & Revenue History */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Staff List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5" /> Reporting Staff ({manager.staffCount})
                                </h3>
                                <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase">View All</Button>
                            </div>
                            <div className="space-y-3">
                                {manager.staffPreview?.map((staff) => (
                                    <div key={staff.id} className="flex items-center gap-3 bg-white/40 p-2 rounded-2xl border border-white/20 transition-all hover:border-primary/20">
                                        <Avatar className="h-8 w-8 rounded-xl border border-white/40">
                                            <AvatarImage src={staff.avatar_url} />
                                            <AvatarFallback className="text-[10px] font-bold">
                                                {staff.full_name?.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-xs font-bold leading-none">{staff.full_name}</div>
                                            <div className="text-[9px] font-medium text-muted-foreground uppercase mt-1">{staff.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Trend */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5" /> Branch Revenue (5mo)
                            </h3>
                            <div className="h-32 flex items-end gap-1.5 pb-2">
                                {manager.revenueHistory?.map((val, i) => (
                                    <div 
                                        key={i}
                                        className="flex-1 bg-primary/10 rounded-t-lg transition-all hover:bg-primary/30 relative group"
                                        style={{ height: `${(val / Math.max(...manager.revenueHistory)) * 100}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${val}
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

function Button({ children, variant, className, onClick, ...props }) {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    const variants = {
        link: "text-primary underline-offset-4 hover:underline",
    }
    return (
        <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    )
}
