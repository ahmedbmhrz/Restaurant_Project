import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { SalesForecast } from "../components/aipagecomponents/SalesForecast"
import { BusyHours } from "../components/aipagecomponents/BusyHours"
import { AIRecommendations } from "../components/aipagecomponents/AIRecommendations"
import { BranchSelector } from "../components/aipagecomponents/BranchSelector"

const AIPrediction = () => {
    // Now using a single string state for the selected branch/view
    const [selectedBranch, setSelectedBranch] = useState("all")

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
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Charts Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section>
                            <SalesForecast selectedBranch={selectedBranch} />
                        </section>

                        <section>
                            <BusyHours selectedBranch={selectedBranch} />
                        </section>
                    </div>

                    {/* Recommendations Sidebar */}
                    <div className="lg:col-span-1">
                        <AIRecommendations selectedBranch={selectedBranch} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AIPrediction
