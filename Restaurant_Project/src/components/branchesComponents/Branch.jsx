import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Building2, TrendingUp, Users, MapPin } from "lucide-react"

export function Branch({ data }) {
    if (!data) return null;

    return (
        <div className="p-4">
            <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-muted/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {/* Decorative background element */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">{data.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {data.location}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20">
                            <TrendingUp className="mr-1 h-3.3 w-3.3" />
                            {data.growth}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground/90">
                        {data.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-background/50 p-3 ring-1 ring-border/50 transition-colors hover:bg-background">
                            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                Staff
                            </div>
                            <div className="text-lg font-bold">{data.staff}</div>
                        </div>
                        <div className="rounded-lg bg-background/50 p-3 ring-1 ring-border/50 transition-colors hover:bg-background">
                            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Revenue
                            </div>
                            <div className="text-lg font-bold text-primary">{data.revenue}</div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2">
                    <Button className="w-full transition-all duration-300 hover:gap-3 group/btn" variant="default">
                        Manage Branch
                        <Building2 className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

