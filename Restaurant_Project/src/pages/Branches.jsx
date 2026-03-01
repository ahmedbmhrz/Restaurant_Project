import { Navbar } from "@/components/Navbar"
import { LayoutDashboard, Users, DollarSign, Utensils, BarChart3 } from "lucide-react"
import { IncomeBranchTracker } from "@/components/homepagecomponents/IncomeBranchTracker"
import { Notification } from "@/components/homepagecomponents/Notification"
import { BranchManager } from "../components/homepagecomponents/BranchManager"
import { Prediction } from "../components/homepagecomponents/Prediction"
import { IncomeTargetProgress } from "../components/homepagecomponents/IncomeTargetProgress"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { Card, } from "@/components/ui/card"
import { Branch } from "../components/branchesComponents/Branch"
import { Manager } from "../components/branchesComponents/Manager"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Menu } from "../components/branchesComponents/Menu"
import { Income } from "../components/branchesComponents/Income"
import { Charts } from "../components/branchesComponents/Charts"
import { db } from "../data/db"

function Branches() {
    return (
        <div className="h-screen flex flex-col bg-muted/90 overflow-hidden">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-6 h-[calc(100vh-64px)] overflow-hidden">
                <Card className="flex-3 h-full flex flex-col min-h-0 overflow-hidden border-none shadow-xl bg-background/50 backdrop-blur-sm">
                    <div className="p-6 border-b bg-card/50 flex-none">
                        <h2 className="text-xl font-bold tracking-tight">Branch Insights</h2>
                    </div>
                    <Tabs defaultValue="branch" className="flex-1 flex flex-col min-h-0">
                        <div className="px-6 border-b bg-card/30 backdrop-blur-md sticky top-0 z-10">
                            <TabsList className="bg-transparent border-none p-0 gap-8 h-12 center">
                                <TabsTrigger value="branch" className="   text-muted-foreground data-[state=active]:text-primary  data-[state=active]:shadow-none data-[state=active]:bg-gray-100 transition-all duration-200 hover:text-primary/70">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Branch Explorer</span>
                                </TabsTrigger>
                                <TabsTrigger value="manager" className="  text-muted-foreground data-[state=active]:text-primary  data-[state=active]:shadow-none data-[state=active]:bg-gray-100 transition-all duration-200 hover:text-primary/70">
                                    <Users className="h-4 w-4" />
                                    <span>Manager Info</span>
                                </TabsTrigger>
                                <TabsTrigger value="income" className="  text-muted-foreground data-[state=active]:text-primary  data-[state=active]:shadow-none data-[state=active]:bg-gray-100 transition-all duration-200 hover:text-primary/70">
                                    <DollarSign className="h-4 w-4" />
                                    <span>Income</span>
                                </TabsTrigger>
                                <TabsTrigger value="menu" className="  text-muted-foreground data-[state=active]:text-primary  data-[state=active]:shadow-none data-[state=active]:bg-gray-100 transition-all duration-200 hover:text-primary/70">
                                    <Utensils className="h-4 w-4" />
                                    <span>Menu View</span>
                                </TabsTrigger>
                                <TabsTrigger value="charts" className="  text-muted-foreground data-[state=active]:text-primary  data-[state=active]:shadow-none data-[state=active]:bg-gray-100 transition-all duration-200 hover:text-primary/70">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Charts</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6">
                            <TabsContent value="branch" className="mt-0 outline-none animate-in fade-in slide-in-from-left-2 duration-300">
                                <Branch data={db.branchData} />
                            </TabsContent>
                            <TabsContent value="manager" className="mt-0 outline-none animate-in fade-in slide-in-from-left-2 duration-300">
                                <Manager manager={db.managers.find(m => m.isTopManager)} />
                            </TabsContent>
                            <TabsContent value="income" className="mt-0 outline-none animate-in fade-in slide-in-from-left-2 duration-300">
                                <Income data={db.incomeData} />
                            </TabsContent>
                            <TabsContent value="menu" className="mt-0 outline-none animate-in fade-in slide-in-from-left-2 duration-300">
                                <Menu data={db.menuData} />
                            </TabsContent>
                            <TabsContent value="charts" className="mt-0 outline-none animate-in fade-in slide-in-from-left-2 duration-300">
                                <Charts data={db.operationalData} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>
                <div className="flex-1 min-w-[350px] h-full min-h-0 overflow-hidden">
                    <ManagersnBranch managers={db.managers} />
                </div>
            </main>
        </div>
    )
}


export default Branches