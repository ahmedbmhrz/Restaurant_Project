import { Navbar } from "@/components/Navbar"
import { IncomeBranchTracker } from "@/components/homepagecomponents/IncomeBranchTracker"
import { Notification } from "@/components/homepagecomponents/Notification"
import { BranchManager } from "../components/homepagecomponents/BranchManager"
import { Prediction } from "../components/homepagecomponents/Prediction"
import { IncomeTargetProgress } from "../components/homepagecomponents/IncomeTargetProgress"
import { ManagersnBranch } from "../components/branchesComponents/ManagersnBranch"
import { Card, } from "@/components/ui/card"
import { Branch } from "../components/branchesComponents/Branch"
import { Manager } from "../components/branchesComponents/Manager"
import { ScrollArea } from "@/components/ui/scroll-area"
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
                    <ScrollArea className="flex-1 min-h-0 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                            <Branch data={db.branchData} />
                            <Manager manager={db.managers.find(m => m.isTopManager)} />
                            <Income data={db.incomeData} />
                            <Menu />
                            <Charts />
                        </div>
                    </ScrollArea>
                </Card>
                <div className="flex-1 min-w-[350px] h-full min-h-0 overflow-hidden">
                    <ManagersnBranch managers={db.managers} />
                </div>
            </main>
        </div>
    )
}


export default Branches