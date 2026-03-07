import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PackageCheck, PackageX } from "lucide-react"

export function MenuHealth({ stats }) {
    if (!stats) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Stock Health</div>
                    <div className="text-2xl font-black text-amber-600">{stats.health}</div>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <PackageCheck className="h-3 w-3 text-emerald-500" />
                            {stats.active}
                        </div>
                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground/40">Active</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                            <PackageX className="h-3 w-3 text-rose-500" />
                            {stats.outOfStock}
                        </div>
                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground/40">OOS</span>
                    </div>
                </div>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="cursor-help py-1">
                        <Progress value={parseInt(stats.health)} className="h-1 bg-amber-500/10" indicatorClassName="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="text-[10px] font-medium">
                    Overall inventory availability vs menu items.
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
