import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UtensilsCrossed, Star, TrendingUp, ChevronRight, PackageCheck, PackageX, Info } from "lucide-react"

export function Menu({ data }) {
    if (!data) return null;

    return (
        <TooltipProvider>
            <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-secondary/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:col-span-2">
                {/* Ambient Background Glows */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />

                <div className="relative flex flex-col lg:flex-row">
                    {/* Left Side: Highlight & Stats */}
                    <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border/50">
                        <CardHeader className="p-0 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600 shadow-sm ring-1 ring-amber-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                                        <UtensilsCrossed className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Menu Spotlight</CardTitle>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Real-time Performance</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Featured Dish Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/10 to-transparent p-5 ring-1 ring-amber-500/20 mb-6 group/dish">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-4xl">{data.highlightDish.image}</div>
                                    <Badge variant="outline" className="bg-background/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-amber-600 border-amber-500/20">
                                        <Star className="h-3.5 w-3.5 fill-amber-500 mr-1.5" />
                                        {data.highlightDish.rating}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight group-hover:text-amber-600 transition-colors uppercase italic">{data.highlightDish.name}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xl font-bold text-foreground/80">{data.highlightDish.price}</span>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/60 border-none bg-muted/50">
                                            {data.highlightDish.orders} Orders
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Health */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Stock Health</div>
                                        <div className="text-2xl font-black text-amber-600">{data.stats.health}</div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                                <PackageCheck className="h-3 w-3 text-emerald-500" />
                                                {data.stats.active}
                                            </div>
                                            <span className="text-[8px] uppercase tracking-tighter text-muted-foreground/40">Active</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                                <PackageX className="h-3 w-3 text-rose-500" />
                                                {data.stats.outOfStock}
                                            </div>
                                            <span className="text-[8px] uppercase tracking-tighter text-muted-foreground/40">OOS</span>
                                        </div>
                                    </div>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help py-1">
                                            <Progress value={parseInt(data.stats.health)} className="h-1 bg-amber-500/10" indicatorClassName="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-[10px] font-medium">
                                        Overall inventory availability vs menu items.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </CardContent>
                    </div>

                    {/* Right Side: Signature Jewels */}
                    <div className="flex-1 p-6 bg-muted/20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Signature Jewels</div>
                            <TrendingUp className="h-4 w-4 text-amber-500/50" />
                        </div>

                        <div className="space-y-3">
                            {data.topItems.map((item, idx) => (
                                <div key={idx} className="group/item relative flex items-center justify-between rounded-2xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 hover:bg-background/80 hover:ring-amber-500/30 hover:shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-xl font-bold transition-transform group-hover/item:scale-110">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold tracking-tight">{item.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-medium text-muted-foreground">{item.orders} Orders</span>
                                                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                <Badge variant="outline" className="h-4 text-[8px] font-black uppercase tracking-tighter border-none bg-amber-500/5 text-amber-600">
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-black text-foreground/80">{item.price}</span>
                                        <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover/item:text-amber-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-8 bg-amber-500/10" />

                        <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/10 relative overflow-hidden group/quote">
                            <div className="absolute -right-2 -top-2 opacity-10 rotate-12 transition-transform duration-500 group-hover/quote:scale-150">
                                <UtensilsCrossed className="h-12 w-12 text-amber-600" />
                            </div>
                            <p className="text-[11px] leading-relaxed text-muted-foreground/80 italic font-medium relative z-10 uppercase tracking-tighter">
                                "Innovation is the secret ingredient that turns a menu into a legend."
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    )
}
