import { LayoutDashboard, Users, DollarSign, Utensils, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Branch } from "./Branch"
import { Manager } from "./ManagerInfo"
import { Menu } from "./Menu"
import { Income } from "./Income"
import { Charts } from "./Charts"

const tabTriggerClasses = "justify-start inline-flex items-center gap-3 text-slate-500 font-bold data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:bg-white transition-all duration-300 hover:text-slate-700 hover:bg-white/50 px-5 py-3 rounded-2xl w-full"
const tabContentClasses = "mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500 h-full"

export function BranchTabs({ isFetching, pageData, fetchPageData }) {
    return (
        <Tabs defaultValue="branch" orientation="vertical" className="flex-1 flex min-h-0 bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden h-full">
            
            {/* Left Sidebar Navigation */}
            <div className="w-64 border-r border-slate-200/50 bg-white/20 backdrop-blur-md sticky top-0 z-10 flex flex-col p-4">
                <TabsList className="flex flex-col bg-transparent border-none p-0 gap-2 h-auto w-full">
                    <TabsTrigger value="branch" className={tabTriggerClasses}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="font-bold tracking-wide">Branch Explorer</span>
                    </TabsTrigger>
                    <TabsTrigger value="manager" className={tabTriggerClasses}>
                        <Users className="h-5 w-5" />
                        <span className="font-bold tracking-wide">Manager Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="income" className={tabTriggerClasses}>
                        <DollarSign className="h-5 w-5" />
                        <span className="font-bold tracking-wide">Income</span>
                    </TabsTrigger>
                    <TabsTrigger value="menu" className={tabTriggerClasses}>
                        <Utensils className="h-5 w-5" />
                        <span className="font-bold tracking-wide">Menu View</span>
                    </TabsTrigger>
                    <TabsTrigger value="charts" className={tabTriggerClasses}>
                        <BarChart3 className="h-5 w-5" />
                        <span className="font-bold tracking-wide">Charts</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 relative bg-white/10">
                {isFetching && (
                    <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none p-8">
                        <Skeleton className="h-full w-full rounded-3xl bg-slate-200/50" />
                    </div>
                )}
                <div className={`transition-opacity duration-500 h-full p-8 ${isFetching ? 'opacity-30' : 'opacity-100'}`}>
                    <TabsContent value="branch" className={tabContentClasses}>
                        <Branch 
                            data={pageData.branchesFromDb[0]} 
                            allBranches={pageData.allBranches}
                            staffList={pageData.operationalData.fullStaffList}
                            allUsers={pageData.operationalData.allUsers}
                            refreshData={fetchPageData}
                        />
                    </TabsContent>
                    <TabsContent value="manager" className={tabContentClasses}>
                        <Manager manager={pageData.managers.find(m => m.isTopManager)} />
                    </TabsContent>
                    <TabsContent value="income" className={tabContentClasses}>
                        <Income data={pageData.incomeData} />
                    </TabsContent>
                    <TabsContent value="menu" className={tabContentClasses}>
                        <Menu 
                            data={pageData.menuData} 
                            branchId={pageData.targetBranchId} 
                            refreshData={fetchPageData}
                        />
                    </TabsContent>
                    <TabsContent value="charts" className={tabContentClasses}>
                        <Charts data={pageData.operationalData} />
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    )
}
