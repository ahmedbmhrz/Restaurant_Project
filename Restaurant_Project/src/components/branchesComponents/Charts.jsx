import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Users, Store, Zap, Clock } from "lucide-react"

// --- Extracted Sub-components ---
import { DashboardHeader } from "./chartsfolder/DashboardHeader"
import { TrafficTab } from "./chartsfolder/TrafficTab"
import { DepartmentTable } from "./chartsfolder/DepartmentTable"
import { ActivityLog } from "./chartsfolder/ActivityLog"

// --- Main Component ---

export function Charts({ data }) {
    if (!data) return null;

    return (
        <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-secondary/30 shadow-xl transition-all duration-500 hover:shadow-2xl md:col-span-1 lg:col-span-1 min-h-[480px]">
            {/* Ambient Background Glows */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative p-6 flex flex-col h-full">
                <DashboardHeader />

                <Tabs defaultValue="traffic" className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl border border-indigo-500/10 h-10">
                        <TabsTrigger value="traffic" className="rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Traffic
                        </TabsTrigger>
                        <TabsTrigger value="depts" className="rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Depts
                        </TabsTrigger>
                        <TabsTrigger value="activity" className=" rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Feed
                        </TabsTrigger>
                    </TabsList>

                    <Separator className="my-6 bg-indigo-500/10" />

                    <div className="flex-1 flex flex-col">
                        <TabsContent value="traffic" className="flex-1 flex flex-col data-[state=inactive]:hidden focus-visible:outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Hourly Count</div>
                                <Zap className="h-3 w-3 text-amber-500" />
                            </div>
                            <TrafficTab data={data.traffic} />
                        </TabsContent>

                        <TabsContent value="depts" className="flex-1 data-[state=inactive]:hidden focus-visible:outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Internal Performance</div>
                                <Store className="h-3 w-3 text-indigo-500" />
                            </div>
                            <DepartmentTable departments={data.departments} />
                        </TabsContent>

                        <TabsContent value="activity" className="flex-1 data-[state=inactive]:hidden focus-visible:outline-none">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ">Live Feed</div>
                                <Clock className="h-3 w-3 text-indigo-500" />
                            </div>
                            <ActivityLog activity={data.activity} />
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="mt-6 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/5 px-3 py-1 ring-1 ring-indigo-500/10">
                        <Users className="h-3 w-3 text-indigo-500" />
                        <span className="text-[9px] font-bold text-indigo-600/80 tracking-tight">Active Staff: {data.activeStaff || 0}</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
