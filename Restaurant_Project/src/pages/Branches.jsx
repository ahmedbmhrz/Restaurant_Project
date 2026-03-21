import { Navbar } from "@/components/Navbar"
import { LayoutDashboard, Users, DollarSign, Utensils, BarChart3 } from "lucide-react"
import { IncomeBranchTracker } from "@/components/homepagecomponents/IncomeBranchTracker"
import { Notification } from "@/components/homepagecomponents/Notification"
import { BranchManager } from "../components/homepagecomponents/BranchManager"
import { Prediction } from "../components/homepagecomponents/Prediction"
import { IncomeTargetProgress } from "../components/homepagecomponents/IncomeTargetProgress"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Branch } from "../components/branchesComponents/Branch"
import { Manager } from "../components/branchesComponents/ManagerInfo"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Menu } from "../components/branchesComponents/Menu"
import { Income } from "../components/branchesComponents/Income"
import { Charts } from "../components/branchesComponents/Charts"
import { db } from "../data/db"
import { useState, useEffect } from "react"

function Branches() {
    const [pageData, setPageData] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchPageData = async () => {
            setIsFetching(true);
            try {
                const url = selectedBranchId
                    ? `http://localhost:5000/api/branches-page-data?branchId=${selectedBranchId}`
                    : 'http://localhost:5000/api/branches-page-data';

                const res = await fetch(url, { cache: 'no-store' });
                const data = await res.json();

                const formattedManagers = data.managers.map((m) => {
                    return {
                        ...m,
                        role: m.role ? m.role.replace('_', ' ') : 'Managing Director',
                        isTopManager: m.branch_id === data.targetBranchId
                    };
                });

                setPageData({
                    ...data,
                    managers: formattedManagers
                });
            } catch (error) {
                console.error("Error loading branch page data:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchPageData();
    }, [selectedBranchId]); // Add selectedBranchId as dependency!

    if (!pageData) {
        return (
            <div className="h-screen flex flex-col bg-muted/90 overflow-hidden">
                <Navbar />
                <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6 animate-pulse">
                        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-primary font-bold tracking-widest uppercase">Initializing Dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-muted/90 overflow-hidden">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 h-[calc(100vh-64px)] overflow-hidden">
                <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-none shadow-2xl bg-background/60 backdrop-blur-2xl rounded-3xl p-8 gap-8">
                    <div className="flex-none border-b pb-6">
                        <h2 className="text-4xl font-extrabold tracking-tight text-primary">Branch Insights</h2>
                    </div>
                    <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 overflow-hidden">
                        <Tabs defaultValue="branch" orientation="vertical" className="flex-1 flex min-h-0 bg-gray-100 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden border border-white/20">
                            <div className="w-64 border-r bg-muted/10 backdrop-blur-md sticky top-0 z-10 border-white/10">
                                <TabsList className="flex flex-col bg-transparent border-none p-4 gap-2 h-auto w-full">
                                    <TabsTrigger value="branch" className="justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full">
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span className="font-medium">Branch Explorer</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="manager" className="justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full">
                                        <Users className="h-5 w-5" />
                                        <span className="font-medium">Manager Info</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="income" className="justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full">
                                        <DollarSign className="h-5 w-5" />
                                        <span className="font-medium">Income</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="menu" className="justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full">
                                        <Utensils className="h-5 w-5" />
                                        <span className="font-medium">Menu View</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="charts" className="justify-start inline-flex items-center gap-2 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:bg-background/80 transition-all duration-300 hover:text-primary/70 px-4 py-3 rounded-xl w-full">
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
                                    <TabsContent value="branch" className="mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Branch 
                                            data={pageData.branchesFromDb[0]} 
                                            staffList={pageData.operationalData.fullStaffList}
                                            allUsers={pageData.operationalData.allUsers}
                                        />
                                    </TabsContent>
                                    <TabsContent value="manager" className="mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Manager manager={pageData.managers.find(m => m.isTopManager)} />
                                    </TabsContent>
                                    <TabsContent value="income" className="mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Income data={pageData.incomeData} />
                                    </TabsContent>
                                    <TabsContent value="menu" className="mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Menu 
                                            data={pageData.menuData} 
                                            branchId={pageData.targetBranchId} 
                                        />
                                    </TabsContent>
                                    <TabsContent value="charts" className="mt-0 outline-none animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Charts data={pageData.operationalData} />
                                    </TabsContent>
                                </div>
                            </div>
                        </Tabs>
                        <div className="flex-1 lg:max-w-md h-full min-h-0 overflow-hidden bg-gray-100 backdrop-blur-md rounded-2xl shadow-sm p-8 border border-white/20">
                            <ManagersnBranch
                                managers={pageData.managers}
                                selectedBranchId={pageData.targetBranchId}
                                onSelectManager={setSelectedBranchId}
                            />
                        </div>
                    </div>
                </Card>

            </main>
        </div>
    )
}


export default Branches