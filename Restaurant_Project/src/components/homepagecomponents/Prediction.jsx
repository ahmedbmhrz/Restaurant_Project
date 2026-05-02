import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react"

export function Prediction() {
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
                
                <div className="flex-1 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-indigo-500/10 p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600">
                        <TrendingUp className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Revenue Projection</h4>
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                        <strong className="text-indigo-700">Branch A</strong> and <strong className="text-indigo-700">C</strong> are projected to experience a <strong className="text-emerald-600">12% increase</strong> in income next month based on current traffic trends.
                    </p>
                </div>

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
