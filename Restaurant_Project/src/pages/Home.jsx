import { Navbar } from "@/components/Navbar"
import { IncomeBranchTracker } from "@/components/homepagecomponents/IncomeBranchTracker"
import { Notification } from "@/components/homepagecomponents/Notification"
import { BranchManager } from "../components/homepagecomponents/BranchManager"
import { Prediction } from "../components/homepagecomponents/Prediction"
import { IncomeTargetProgress } from "../components/homepagecomponents/IncomeTargetProgress"




function Home() {

    return (
        <div className="min-h-svh flex flex-col bg-muted/90">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 space-y-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    <IncomeBranchTracker />

                    <Notification />

                </div>
                <div className="flex flex-col lg:flex-row gap-4">

                    <BranchManager />

                    <Prediction />

                    <IncomeTargetProgress />

                </div>
            </main>
        </div>
    )
}

export default Home