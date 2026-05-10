import { Navbar } from "@/components/Navbar"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { BranchTabs } from "../components/branchesComponents/BranchTabs"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

function Branches() {
    const location = useLocation();
    const [pageData, setPageData] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(location.state?.targetBranchId || null);
    const [isFetching, setIsFetching] = useState(false);

    // Update selected branch if navigation state changes while on page
    useEffect(() => {
        if (location.state?.targetBranchId) {
            setSelectedBranchId(location.state.targetBranchId);
        }
    }, [location.state]);

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

        // Listen for global Quick Creation events to auto-refresh data smoothly
        const handleQuickAction = () => {
            fetchPageData();
        };
        window.addEventListener('quickActionComplete', handleQuickAction);
        
        return () => {
            window.removeEventListener('quickActionComplete', handleQuickAction);
        };
    }, [selectedBranchId]); 

    if (!pageData) {
        return (
            <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
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
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <Navbar />
            <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 h-[calc(100vh-64px)] overflow-hidden w-full">
                
                {/* Clean Header */}
                <div className="flex-none pb-2 pl-2">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-800">Branch Insights</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage and monitor all regional locations</p>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden w-full">
                    {/* Left Side: Branch Tabs (Takes up more space) */}
                    <div className="flex-[3] min-w-0 min-h-0 h-full">
                        <BranchTabs 
                            isFetching={isFetching} 
                            pageData={pageData} 
                            fetchPageData={fetchPageData} 
                        />
                    </div>
                    
                    {/* Right Side: Managers Panel (Glassmorphism wrapper) */}
                    <div className="flex-1 lg:max-w-md h-full min-h-0 overflow-hidden bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6">
                        <ManagersnBranch
                            managers={pageData.managers}
                            branches={pageData.allBranches}
                            allUsers={pageData.operationalData.allUsers}
                            selectedBranchId={pageData.targetBranchId}
                            onSelectManager={setSelectedBranchId}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Branches