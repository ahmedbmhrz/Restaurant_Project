import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Activity, CheckCircle2, ArrowUpRight, Clock, CalendarDays } from "lucide-react"

function formatTime(isoStr) {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(isoStr) {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function computeDuration(clockIn, clockOut) {
    if (!clockIn || !clockOut) return null;
    const diffMs = new Date(clockOut) - new Date(clockIn);
    const totalMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    return `${hours}h ${minutes}m`;
}

export function ManagerReportModal({ manager, growthSign }) {
    if (!manager) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full transition-all duration-300 hover:bg-primary group/btn shadow-md hover:text-white" variant="secondary">
                    View Detailed Report
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-background">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Performance Audit: {manager.name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Comprehensive metrics and administrative overview for the current period.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl bg-card border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-black text-primary mb-1">${(manager.currentRevenue || 0).toLocaleString()}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">30-Day Revenue</div>
                        </div>
                        <div className="rounded-xl bg-card border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-black mb-1">{growthSign}{manager.growth}%</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">MoM Growth</div>
                        </div>
                        <div className="rounded-xl bg-card border p-4 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="text-2xl font-black mb-1 text-emerald-600">{manager.performance}</div>
                            <div className="text-xs font-bold text-emerald-700/70 uppercase tracking-widest">Global Rank</div>
                        </div>
                    </div>

                    {/* Action History */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Recent Administrative Logs</h4>
                        <div className="rounded-xl border bg-muted/20 p-1">
                            {manager.recentShifts?.length > 0 ? manager.recentShifts.map((shift, idx) => {
                                const isCompleted = shift.status === 'Completed';
                                const duration = computeDuration(shift.clock_in, shift.clock_out);
                                const isLast = idx === manager.recentShifts.length - 1;
                                const isFirst = idx === 0;
                                return (
                                    <div key={shift.id} className={`p-4 bg-card ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : 'border-b border-border/50'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`mt-0.5 h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                                    {isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Activity className="h-4 w-4 text-blue-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-bold">Shift {isCompleted ? 'Completed' : 'In Progress'}</p>
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {shift.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>In: <span className="font-semibold text-foreground">{formatTime(shift.clock_in)}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Out: <span className="font-semibold text-foreground">{formatTime(shift.clock_out)}</span></span>
                                                        </div>
                                                        {duration && (
                                                            <div className="col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                                <CalendarDays className="h-3 w-3" />
                                                                <span>Duration: <span className="font-semibold text-foreground">{duration}</span></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">{formatDate(shift.clock_in)}</div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-4 text-center text-sm font-medium text-muted-foreground bg-card rounded-xl">No recent shift logs found in the database.</div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
