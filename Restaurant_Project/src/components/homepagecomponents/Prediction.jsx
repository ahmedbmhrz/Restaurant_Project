import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

const severityConfig = {
    positive: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    negative: { icon: TrendingDown, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    neutral: { icon: Minus, color: "text-indigo-600", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
}

export function Prediction() {
    const [insight, setInsight] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/predict/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ branchId: 'all' })
                })
                const data = await res.json()
                if (data.insights && data.insights.length > 0) {
                    setInsight(data.insights[0])
                }
                setLoading(false)
            } catch (err) {
                console.error("Error fetching AI insights:", err)
                setLoading(false)
            }
        }
        fetchInsights()
    }, [])

    const config = insight ? severityConfig[insight.severity] || severityConfig.neutral : severityConfig.neutral;
    const Icon = config.icon;

    return (
        <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden relative group">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">AI Insights</h2>
                        <p className="text-xs font-medium text-slate-500">Machine learning forecasts</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-6 gap-4">
                
                {loading ? (
                    <div className="flex-1 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 p-5 flex flex-col items-center justify-center gap-3">
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-600" />
                        <p className="text-xs font-bold text-indigo-600/70 animate-pulse">Running ML models...</p>
                    </div>
                ) : !insight ? (
                    <div className="flex-1 bg-gradient-to-br from-slate-500/5 to-slate-500/5 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-slate-500">Not enough data to generate forecast.</p>
                    </div>
                ) : (
                    <div className={`flex-1 bg-gradient-to-br ${config.bg} to-white/50 rounded-2xl border ${config.border} p-5 flex flex-col justify-center relative overflow-hidden`}>
                        {/* Status Glow */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-40 ${config.bg}`} />
                        
                        <div className={`flex items-center gap-2 mb-3 ${config.color} relative z-10`}>
                            <Icon className="h-4 w-4" />
                            <h4 className="text-xs font-bold uppercase tracking-wider">{insight.title}</h4>
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed relative z-10">
                            {insight.description}
                        </p>
                    </div>
                )}

                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 group-hover:shadow-lg transition-all rounded-xl h-12">
                    <Link to="/ai-prediction" className="flex items-center justify-center gap-2 font-bold">
                        View Full Analysis
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
