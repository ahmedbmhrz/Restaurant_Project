import { Navbar } from "@/components/Navbar"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { BranchTabs } from "../components/branchesComponents/BranchTabs"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Building2, ArrowRight, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Branches() {
    const location = useLocation();
    const [pageData, setPageData] = useState(null); // Force fresh load to bypass old cache
    const [selectedBranchId, setSelectedBranchId] = useState(location.state?.targetBranchId || null);
    const [openHubTrigger, setOpenHubTrigger] = useState(location.state?.openManagementHub ? Date.now() : null);
    const [isFetching, setIsFetching] = useState(false);
    const [firstCreatedBranch, setFirstCreatedBranch] = useState(null);
    const [copied, setCopied] = useState(false);

    // Update selected branch if navigation state changes while on page
    useEffect(() => {
        if (location.state?.targetBranchId) {
            setSelectedBranchId(location.state.targetBranchId);
        }
        if (location.state?.openManagementHub) {
            setOpenHubTrigger(Date.now()); // Use timestamp to force re-trigger if clicked again
        }
    }, [location.state]);

    const fetchPageData = async () => {
        setIsFetching(true);
        try {
            const url = selectedBranchId
                ? `/api/branches-page-data?branchId=${selectedBranchId}`
                : '/api/branches-page-data';

            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();

            // Format managers only if managers array exists
            const formattedManagers = (data.managers || []).map((m) => {
                return {
                    ...m,
                    role: m.role ? m.role.replace('_', ' ') : 'Managing Director',
                    isTopManager: m.branch_id === data.targetBranchId
                };
            });

            const newPageData = {
                ...data,
                managers: formattedManagers
            };

            setPageData(newPageData);
            localStorage.setItem('nexus_dashboard_cache', JSON.stringify(newPageData));
        } catch (error) {
            console.error("Error loading branch page data:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleCreateFirstBranch = async (e) => {
        e.preventDefault();
        const name = e.target.branchName.value;
        const address = e.target.branchAddress.value;
        const description = e.target.branchDesc.value;
        
        try {
            const res = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, description })
            });
            if (res.ok) {
                const newBranch = await res.json();
                setFirstCreatedBranch(newBranch);
            }
        } catch (error) {
            console.error("Failed to create first branch:", error);
        }
    };

    const handleCopyCode = (code) => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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

    if (pageData && (!pageData.allBranches || pageData.allBranches.length === 0)) {
        return (
            <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
                <Navbar />
                <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
                    <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 flex flex-col gap-8 transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                        {firstCreatedBranch ? (
                            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
                                <div className="mx-auto h-16 w-16 bg-[#00ADB5]/10 text-[#00ADB5] rounded-3xl flex items-center justify-center shadow-inner animate-bounce">
                                    <Check className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-800">Branch Registered Successfully!</h3>
                                    <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                                        Your first storefront is live. Share this secure one-time activation code with your Branch Manager to activate their terminal and dashboard access.
                                    </p>
                                </div>
                                
                                <div className="bg-white/80 border border-white/60 rounded-3xl p-6 shadow-inner relative group max-w-md mx-auto">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] block mb-2">
                                        One-Time Branch Access Code
                                    </span>
                                    <span className="text-3xl font-black tracking-widest text-[#222831] select-all font-mono">
                                        {firstCreatedBranch.access_code}
                                    </span>
                                </div>
                                
                                <div className="flex gap-4 max-w-md mx-auto">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase gap-2 border-white/60 bg-white/70 hover:bg-white transition-all shadow-sm"
                                        onClick={() => handleCopyCode(firstCreatedBranch.access_code)}
                                    >
                                        <Copy className="h-4 w-4" />
                                        {copied ? "Copied!" : "Copy Code"}
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 bg-[#222831] hover:bg-[#393E46] text-white rounded-2xl font-bold text-xs uppercase shadow-md transition-all"
                                        onClick={() => {
                                            setSelectedBranchId(firstCreatedBranch.id);
                                            fetchPageData();
                                        }}
                                    >
                                        Continue to Dashboard
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 text-center">
                                    <div className="mx-auto h-16 w-16 bg-[#00ADB5]/10 text-[#00ADB5] rounded-3xl flex items-center justify-center shadow-inner animate-bounce">
                                        <Building2 className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight text-slate-800 mt-2">Launch Your First Branch</h2>
                                    <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
                                        Welcome to Nexus Food! To unlock your real-time analytics, shifts, and branch management, let's setup your primary storefront.
                                    </p>
                                </div>
                                
                                <form onSubmit={handleCreateFirstBranch} className="flex flex-col gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="branchName" className="text-sm font-bold text-slate-600 ml-1">Branch Name</Label>
                                        <Input 
                                            id="branchName" 
                                            name="branchName" 
                                            placeholder="e.g. Kadikoy Central" 
                                            required 
                                            className="bg-white/70 border-white/60 focus:bg-white focus:border-[#00ADB5] rounded-2xl h-12 px-4 transition-all shadow-sm"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="branchAddress" className="text-sm font-bold text-slate-600 ml-1">Branch Address</Label>
                                        <Input 
                                            id="branchAddress" 
                                            name="branchAddress" 
                                            placeholder="e.g. Moda Cd. No:12, Istanbul" 
                                            required 
                                            className="bg-white/70 border-white/60 focus:bg-white focus:border-[#00ADB5] rounded-2xl h-12 px-4 transition-all shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="branchDesc" className="text-sm font-bold text-slate-600 ml-1">Description</Label>
                                        <Input 
                                            id="branchDesc" 
                                            name="branchDesc" 
                                            placeholder="e.g. Flagship bistro serving Anatolian fusion dishes" 
                                            required 
                                            className="bg-white/70 border-white/60 focus:bg-white focus:border-[#00ADB5] rounded-2xl h-12 px-4 transition-all shadow-sm"
                                        />
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-[#222831] hover:bg-[#393E46] text-white font-bold h-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2 group"
                                    >
                                        <span>Launch Branch</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </form>
                            </>
                        )}
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
                            openHubTrigger={openHubTrigger}
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