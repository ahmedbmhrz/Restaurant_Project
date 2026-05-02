import { LayoutDashboard, Users, DollarSign, Utensils, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Branch } from "./Branch"
import { Manager } from "./ManagerInfo"
import { Menu } from "./Menu"
import { Income } from "./Income"
import { Charts } from "./Charts"

const tabTriggerClasses = "justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full"
const tabContentClasses = "mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500"

export function BranchTabs({ isFetching, pageData, fetchPageData }) {
    return (
        <Tabs defaultValue="branch" orientation="vertical" className="flex-1 flex min-h-0 bg-gray-100 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden border border-white/20">
            <div className="w-64 border-r bg-muted/10 backdrop-blur-md sticky top-0 z-10 border-white/10">
                <TabsList className="flex flex-col bg-transparent border-none p-4 gap-2 h-auto w-full">
                    <TabsTrigger value="branch" className={tabTriggerClasses}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="font-medium">Branch Explorer</span>
                    </TabsTrigger>
                    <TabsTrigger value="manager" className={tabTriggerClasses}>
                        <Users className="h-5 w-5" />
                        <span className="font-medium">Manager Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="income" className={tabTriggerClasses}>
                        <DollarSign className="h-5 w-5" />
                        <span className="font-medium">Income</span>
                    </TabsTrigger>
                    <TabsTrigger value="menu" className={tabTriggerClasses}>
                        <Utensils className="h-5 w-5" />
                        <span className="font-medium">Menu View</span>
                    </TabsTrigger>
                    <TabsTrigger value="charts" className={tabTriggerClasses}>
                        <BarChart3 className="h-5 w-5" />
                        <span className="font-medium">Charts</span>
                    </TabsTrigger>
                </TabsList>
            </div>
            <div className="flex-1 overflow-y-hidden min-h-0 px-8 py-8 relative">
                {isFetching && (
                    <div className="absolute inset-x-8 top-8 bottom-8 z-10 bg-gray-100/40 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none pb-8">
                        <Skeleton className="h-full w-full rounded-3xl" />
                    </div>
                )}
                <div className={`transition-opacity duration-500 ${isFetching ? 'opacity-30' : 'opacity-100'}`}>
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
