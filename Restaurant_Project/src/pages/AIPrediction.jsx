import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { SalesForecast } from "../components/aipagecomponents/SalesForecast"
import { BusyHours } from "../components/aipagecomponents/BusyHours"
import { AIRecommendations } from "../components/aipagecomponents/AIRecommendations"
import { BranchSelector } from "../components/aipagecomponents/BranchSelector"
import { supabase } from "../lib/supabase"

const AIPrediction = () => {
    // Now using a single string state for the selected branch/view
    const [selectedBranch, setSelectedBranch] = useState("all")
    const [branches, setBranches] = useState([{ id: "all", name: "All Branches" }])
    const [selectedBranchName, setSelectedBranchName] = useState("All Branches")

    useEffect(() => {
        const fetchBranches = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const companyId = session?.user?.user_metadata?.company_id;

            let query = supabase
                .from('branches')
                .select('id, name')
                .order('name');

            if (companyId) {
                query = query.eq('company_id', companyId);
            } else {
                query = query.eq('id', '00000000-0000-0000-0000-000000000000');
            }

            const { data } = await query;
            
            if (data) {
                setBranches([{ id: "all", name: "All Branches" }, ...data]);
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        const branch = branches.find(b => b.id === selectedBranch);
        if (branch) {
            setSelectedBranchName(branch.name);
        }
    }, [selectedBranch, branches]);

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            <Navbar />

            <main className="flex-1 p-6 md:p-10 container mx-auto max-w-7xl">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Insights & Predictions</h1>
                    <p className="text-slate-500 mt-1">Smart analysis for data-driven decisions across all branches.</p>
                </header>

                {/* Simplified single-select filter */}
                <BranchSelector
                    selected={selectedBranch}
                    onChange={setSelectedBranch}
                    branches={branches}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Charts Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section>
                            <SalesForecast 
                                selectedBranch={selectedBranch} 
                                branchName={selectedBranchName}
                            />
                        </section>

                        <section>
                            <BusyHours 
                                selectedBranch={selectedBranch} 
                                branchName={selectedBranchName}
                            />
                        </section>
                    </div>

                    {/* Recommendations Sidebar */}
                    <div className="lg:col-span-1">
                        <AIRecommendations 
                            selectedBranch={selectedBranch} 
                            branchName={selectedBranchName}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AIPrediction
