import { TrendingUp, Target, Briefcase } from "lucide-react"

export function ProfileKPIGrid({ growth, performance, tenure }) {
    const kpis = [
        { label: 'Growth', val: growth, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
        { label: 'KPI Score', val: performance, icon: Target, color: 'text-blue-600', bg: 'bg-blue-500/10' },
        { label: 'Tenure', val: tenure, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-500/10' }
    ];

    return (
        <div className="grid grid-cols-3 gap-6">
            {kpis.map((kpi, i) => (
                <div key={i} className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/60 hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}><kpi.icon className="h-3.5 w-3.5" /></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400/80">{kpi.label}</span>
                    </div>
                    <div className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</div>
                </div>
            ))}
        </div>
    );
}
