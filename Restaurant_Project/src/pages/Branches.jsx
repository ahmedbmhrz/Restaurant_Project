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
        <div className="min-h-svh flex flex-col bg-muted/90">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
                <ScrollArea className="flex-3 h-full rounded-md ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        <Branch data={db.branchData} />
                        <Manager manager={db.managers.find(m => m.isTopManager)} />
                        <Income />
                        <Menu />
                        <Charts />
                    </div>
                </ScrollArea>
                <div className="flex-1 min-w-[350px]">
                    <ManagersnBranch managers={db.managers} />
                </div>
            </main>
        </div>
    )
}


export default Branches