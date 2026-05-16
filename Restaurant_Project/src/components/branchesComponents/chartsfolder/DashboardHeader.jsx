import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Activity, Info } from "lucide-react"

export const DashboardHeader = () => (
    <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 shadow-sm ring-1 ring-indigo-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Operational Intelligence</CardTitle>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="h-4 bg-indigo-500/5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 border-indigo-500/20">
                            System Live
                        </Badge>
                        <div className="h-1 w-1 rounded-full bg-indigo-400 animate-ping" />
                    </div>
                </div>
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="rounded-full bg-muted/50 p-2 text-muted-foreground/60 transition-colors hover:bg-indigo-500/10 hover:text-indigo-600 cursor-help border-none outline-none">
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent 
                    side="top" 
                    className="bg-slate-900 text-white border-none shadow-xl text-[10px] font-medium max-w-[200px] z-[100]"
                >
                    Aggregated real-time metrics across all terminal points and kitchen displays.
                </TooltipContent>
            </Tooltip>
        </div>
    </CardHeader>
);
