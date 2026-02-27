import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { UserCheck, Star, Clock, ShieldCheck, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Manager({ manager }) {
    if (!manager) return null;

    return (
        <div className="p-4">
            <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-secondary/30 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {/* Decorative background element */}
                <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-14 w-14 ring-2 ring-primary/20 transition-all duration-500 group-hover:ring-primary/40">
                                    <AvatarImage src={manager.avatarSrc} />
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
                        <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 ring-1 ring-amber-500/20">
                            <Star className="mr-1 h-3.3 w-3.3 fill-amber-500" />
                            {manager.performance}
                        </div>
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
                        <div className="rounded-xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 group-hover:bg-background/60">
                            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <UserCheck className="h-3.5 w-3.5" />
                                Status
                            </div>
                            <div className="text-lg font-bold text-emerald-600">On Duty</div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Growth Metric</span>
                            <span className="text-xs font-bold text-emerald-600">+{manager.growth}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000"
                                style={{ width: `${manager.growth * 10}%` }}
                            />
                        </div>
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
    )
}



