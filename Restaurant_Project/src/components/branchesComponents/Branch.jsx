import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Building2, TrendingUp, Users, MapPin, Info } from "lucide-react"

export function Branch({ data }) {
    if (!data) return null;

    return (
        <TooltipProvider>
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
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold px-3 py-1">
                                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                                {data.growth}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground/90">
                            {data.description}
                        </p>

                        <Separator className="bg-primary/5" />

                        <div className="grid grid-cols-2 gap-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="rounded-lg bg-background/50 p-3 ring-1 ring-border/50 transition-colors hover:bg-background cursor-help">
                                        <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3.5 w-3.5" />
                                                Staff
                                            </div>
                                            <Info className="h-3 w-3 opacity-30" />
                                        </div>
                                        <div className="text-lg font-bold">{data.staff}</div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-[10px] font-medium">
                                    Total active personnel currently clocked into this branch.
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="rounded-lg bg-background/50 p-3 ring-1 ring-border/50 transition-colors hover:bg-background cursor-help">
                                        <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-3.5 w-3.5" />
                                                Revenue
                                            </div>
                                            <Info className="h-3 w-3 opacity-30" />
                                        </div>
                                        <div className="text-lg font-bold text-primary">{data.revenue}</div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-[10px] font-medium">
                                    Total gross revenue generated by this location in the last 24 hours.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button 
                            className="w-full transition-all duration-300 hover:gap-3 group/btn" 
                            variant="default"
                            onClick={() => alert(`Redirecting to Management Portal for: ${data.name}...`)}
                        >
                            Manage Branch
                            <Building2 className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </TooltipProvider>
    )
}

