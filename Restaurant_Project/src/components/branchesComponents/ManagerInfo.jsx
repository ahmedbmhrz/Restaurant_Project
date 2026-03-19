import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCheck, Star, Clock, ShieldCheck, ArrowUpRight, Info } from "lucide-react"

export function Manager({ manager }) {
    if (!manager) return null;

    const growthVal = parseFloat(manager.growth) || 0;
    const isPositive = growthVal >= 0;
    // Map max 25% growth visually to a 100% full progress bar
    const progressWidth = Math.min(100, Math.max(5, Math.abs(growthVal) * 4)); 
    // Shift progress bar color to sophisticated Blue/Indigo to differentiate from Status
    const growthColorText = isPositive ? "text-indigo-600" : "text-orange-600";
    const growthSign = isPositive ? "+" : "";

    const isOffline = manager.status === 'Offline';
    const statusColorText = isOffline ? "text-rose-600" : "text-emerald-600";

    return (
        <TooltipProvider>
            <div className="p-4">
                <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-secondary/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Decorative background element */}
                    <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-14 w-14 ring-2 ring-primary/20 transition-all duration-500 group-hover:ring-primary/40">
                                        {manager.avatarSrc && <AvatarImage src={manager.avatarSrc} />}
                                        <AvatarFallback className="bg-primary/5 text-primary text-lg">{manager.avatarFallback}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1 text-white shadow-sm ring-2 ring-background">
                                        <ShieldCheck className="h-3 w-3" />
                                    </div>
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">{manager.name}</CardTitle>
                                    <CardDescription className="font-medium text-primary/70">{manager.role}</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold px-3 py-1">
                                <Star className="mr-1.5 h-3.5 w-3.5 fill-amber-500" />
                                {manager.performance}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 group-hover:bg-background/60">
                                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <Clock className="h-3.5 w-3.5" />
                                    Tenure
                                </div>
                                <div className="text-lg font-bold">{manager.tenure}</div>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="rounded-xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 group-hover:bg-background/60 cursor-help">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            <UserCheck className="h-3.5 w-3.5" />
                                            Status
                                        </div>
                                        <div className={`text-lg font-bold ${statusColorText}`}>{manager.status || 'On Duty'}</div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-[10px] font-medium">
                                    Last clock-in: {manager.lastActive || 'Recently'}
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Growth Metric</span>
                                <span className={`text-xs font-bold ${growthColorText}`}>{growthSign}{manager.growth}%</span>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="cursor-help py-1.5">
                                        <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden flex items-center shadow-inner">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isPositive ? 'bg-linear-to-r from-blue-400 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-linear-to-r from-orange-400 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}
                                                style={{ width: `${progressWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-[10px] font-medium">
                                    {isPositive ? "Positive trending performance for this period." : "Negative trend requiring attention."}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button className="w-full transition-all duration-300 hover:bg-primary group/btn shadow-md hover:text-white" variant="secondary">
                            View Detailed Report
                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </TooltipProvider>
    )
}



