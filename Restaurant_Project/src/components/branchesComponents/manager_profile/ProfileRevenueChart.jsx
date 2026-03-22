import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp } from "lucide-react"

export function ProfileRevenueChart({ revenueHistory, growth }) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY'];
    const maxRevenue = Math.max(...(revenueHistory || [1]));

    return (
        <div className="col-span-7 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" /> Revenue (5MO)
            </h3>
            <div className="relative group bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 h-[200px] flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-2xl font-black text-slate-800 tracking-tighter">
                            ${revenueHistory?.[4]?.toLocaleString() || '0'}
                        </div>
                        <div className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">This Month's Earnings</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[9px]">
                        {growth}
                    </Badge>
                </div>

                {/* Compact Bar Chart */}
                <div className="h-20 flex items-end gap-2.5 mt-4">
                    {(revenueHistory || [0,0,0,0,0]).map((val, i) => (
                        <div key={i} className="flex-1 group/bar relative h-full flex items-end justify-center">
                            <div 
                                className="w-full bg-amber-500/15 rounded-lg transition-all duration-300 group-hover/bar:bg-amber-500 cursor-pointer"
                                style={{ height: `${(val / (maxRevenue || 1)) * 100}%` }}
                            />
                            <span className="absolute -bottom-5 text-[7px] font-black uppercase text-slate-300 tracking-widest opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                {months[i]}
                            </span>
                        </div>
                    ))}
                </div>
                
                {(!revenueHistory || !revenueHistory.length) && (
                    <div className="absolute inset-0 flex items-center justify-center italic text-slate-300 text-[10px] p-6 text-center">
                        No revenue data available
                    </div>
                )}
            </div>
        </div>
    );
}
