import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Target, Trophy, Pencil, Check, X } from "lucide-react"

export function IncomeTargetProgress() {
    const [progressData, setProgressData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [newTarget, setNewTarget] = useState("")

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/stats/income-target')
            const data = await res.json()
            setProgressData(data)
            setNewTarget(data.target.toString())
            setLoading(false)
        } catch (error) {
            console.error("Error fetching target progress:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/stats/income-target', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: newTarget })
            });
            if (res.ok) {
                setIsEditing(false);
                fetchData(); // Refetch to get new percentage
            }
        } catch (error) {
            console.error("Error saving new target:", error);
        }
    }

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
                
                <div className="text-center space-y-1 relative">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Progress</p>
                    
                    {isEditing ? (
                        <div className="flex items-center justify-center gap-2 scale-90 sm:scale-100">
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter hidden sm:block">
                                ${progressData.current.toLocaleString()}
                            </h3>
                            <span className="text-xl font-bold text-slate-400 hidden sm:block">/</span>
                            <div className="relative flex items-center shadow-sm">
                                <span className="absolute left-3 text-slate-500 font-bold">$</span>
                                <input 
                                    type="number" 
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(e.target.value)}
                                    className="h-10 w-28 pl-7 pr-2 rounded-lg border-2 border-emerald-500/50 focus:border-emerald-500 outline-none font-bold text-slate-700 bg-white/80 shadow-sm"
                                    autoFocus
                                />
                            </div>
                            <button onClick={handleSave} className="h-10 w-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md shrink-0">
                                <Check className="h-5 w-5" />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="h-10 w-10 bg-white text-slate-400 rounded-lg flex items-center justify-center hover:text-slate-600 hover:bg-slate-50 transition-colors border shrink-0">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-baseline justify-center gap-2 group/edit relative inline-flex mx-auto">
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
                                ${progressData.current.toLocaleString()}
                            </h3>
                            <span className="text-sm font-bold text-slate-400">/ ${progressData.target.toLocaleString()}</span>
                            
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-sm border border-slate-200 rounded-md text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 opacity-0 group-hover/edit:opacity-100 transition-all cursor-pointer"
                                title="Edit Target"
                            >
                                <Pencil className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full space-y-3 bg-white/50 p-5 rounded-2xl border border-white/60 shadow-sm transition-all duration-500">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-600">Completion</span>
                        <span className="text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full transition-all duration-500">
                            {progressData.percentage}%
                        </span>
                    </div>
                    <Progress value={progressData.percentage} className="h-4 bg-slate-200/50 [&>*]:bg-emerald-500 transition-all duration-500" />
                    
                    <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-200/50">
                        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 shrink-0 mt-0.5">
                            <Trophy className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                            {progressData.percentage >= 100 
                                ? "Target exceeded! Incredible work reaching the milestone."
                                : "You are on track! Maintain this pace to reach your annual revenue milestone."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
