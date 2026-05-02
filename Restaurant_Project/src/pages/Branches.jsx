import { Navbar } from "@/components/Navbar"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { BranchTabs } from "../components/branchesComponents/BranchTabs"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

function Branches() {
    const [pageData, setPageData] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

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

    useEffect(() => {
        fetchPageData();
    }, [selectedBranchId]); 

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
                        <BranchTabs 
                            isFetching={isFetching} 
                            pageData={pageData} 
                            fetchPageData={fetchPageData} 
                        />
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