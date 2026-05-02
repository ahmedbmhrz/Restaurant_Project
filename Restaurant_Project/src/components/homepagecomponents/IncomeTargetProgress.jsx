import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Target, Trophy } from "lucide-react"

export function IncomeTargetProgress() {
    const [progressData, setProgressData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/income-target')
                const data = await res.json()
                setProgressData(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching target progress:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading || !progressData) {
        return (
            <div className="flex-1 h-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Income Target</h2>
                        <p className="text-xs font-medium text-slate-500">Annual goal tracker</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center p-6 gap-6">
                
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Progress</p>
                    <div className="flex items-baseline justify-center gap-2">
                        <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
                            ${progressData.current.toLocaleString()}
                        </h3>
                        <span className="text-sm font-bold text-slate-400">/ ${progressData.target.toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-full space-y-3 bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-600">Completion</span>
                        <span className="text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                            {progressData.percentage}%
                        </span>
                    </div>
                    <Progress value={progressData.percentage} className="h-4 bg-slate-200/50 [&>*]:bg-emerald-500" />
                    
                    <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-200/50">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 shrink-0 mt-0.5">
                            <Trophy className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            You are on track! Maintain this pace to reach your annual revenue milestone.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
