import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UtensilsCrossed } from "lucide-react"

// New Sub-components
import { MenuSpotlight } from "./menu/MenuSpotlight"
import { MenuHealth } from "./menu/MenuHealth"
import { SignatureJewels } from "./menu/SignatureJewels"
import { MenuQuote } from "./menu/MenuQuote"

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
                            <MenuSpotlight dish={data.highlightDish} />
                            <MenuHealth stats={data.stats} />
                        </CardContent>
                    </div>

                    {/* Right Side: Signature Jewels */}
                    <div className="flex-1">
                        <SignatureJewels items={data.topItems} />

                        <div className="px-6 pb-6 bg-muted/20">
                            <Separator className="mb-8 bg-amber-500/10" />
                            <MenuQuote />
                        </div>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    )
}
