import { Navbar } from "@/components/Navbar"
import { IncomeBranchTracker } from "@/components/homepagecomponents/IncomeBranchTracker"
import { Notification } from "@/components/homepagecomponents/Notification"
import { BranchManager } from "../components/homepagecomponents/BranchManager"
import { Prediction } from "../components/homepagecomponents/Prediction"
import { IncomeTargetProgress } from "../components/homepagecomponents/IncomeTargetProgress"




function Home() {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <Navbar />
            <main className="flex-1 p-4 lg:p-8 flex flex-col gap-6 lg:gap-8">

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[460px]">
                    <IncomeBranchTracker />
                    <Notification />
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-[380px]">
                    <BranchManager />
                    <Prediction />
                    <IncomeTargetProgress />
                </div>
            </main>
        </div>
    )
}

export default Home