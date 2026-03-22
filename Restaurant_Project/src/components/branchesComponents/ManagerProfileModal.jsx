import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

// Modular Profile Sub-components
import { ProfileBanner } from "./manager_profile/ProfileBanner"
import { ProfileHeader } from "./manager_profile/ProfileHeader"
import { ProfileContactBar } from "./manager_profile/ProfileContactBar"
import { ProfileKPIGrid } from "./manager_profile/ProfileKPIGrid"
import { ProfileStaffRoster } from "./manager_profile/ProfileStaffRoster"
import { ProfileRevenueChart } from "./manager_profile/ProfileRevenueChart"

export function ManagerProfileModal({ manager, isOpen, onOpenChange, onJumpToBranch }) {
    if (!manager) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent 
                className="p-0 border-none bg-white rounded-[2rem] shadow-2xl transition-all duration-500 overflow-hidden" 
                style={{ width: '85vw', maxWidth: '950px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* Compact Content Wrapper with Scrollable Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <ProfileBanner 
                        avatarSrc={manager.avatarSrc} 
                        avatarFallback={manager.avatarFallback} 
                    />

                    <div className="px-10 pt-16 pb-8 space-y-8">
                        <ProfileHeader 
                            name={manager.name}
                            role={manager.role}
                            branch_id={manager.branch_id}
                            status={manager.status}
                            lastActive={manager.lastActive}
                        />

                        <ProfileContactBar 
                            email={manager.email}
                            phone={manager.phone}
                        />

                        <ProfileKPIGrid 
                            growth={manager.growth}
                            performance={manager.performance}
                            tenure={manager.tenure}
                        />

                        <Separator className="bg-slate-100" />

                        <div className="grid grid-cols-12 gap-8">
                            <ProfileStaffRoster 
                                staffCount={manager.staffCount}
                                staffPreview={manager.staffPreview}
                                onJumpToBranch={onJumpToBranch}
                            />

                            <ProfileRevenueChart 
                                revenueHistory={manager.revenueHistory}
                                growth={manager.growth}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
