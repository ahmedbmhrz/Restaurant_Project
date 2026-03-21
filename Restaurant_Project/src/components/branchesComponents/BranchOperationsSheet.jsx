import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Building2 } from "lucide-react"

// Modular Sub-components
import { BranchProfileForm } from "./branch_management/BranchProfileForm"
import { LeadershipSection } from "./branch_management/LeadershipSection"
import { StaffingSection } from "./branch_management/StaffingSection"
import { EmergencyControls } from "./branch_management/EmergencyControls"

export function BranchOperationsSheet({ data, staffList = [], allUsers = [] }) {
    
    const handleUpdateBranch = async (payload) => {
        try {
            const res = await fetch(`http://localhost:5000/api/branches/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) window.location.reload(); 
        } catch (error) {
            console.error("Failed to update branch:", error);
        }
    };

    const handleTransferStaff = async (userId, newBranchId, newRole = null) => {
        try {
            await fetch(`http://localhost:5000/api/users/${userId}/branch`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branch_id: newBranchId, role: newRole })
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to transfer staff:", error);
        }
    };

    if (!data) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="w-full transition-all duration-300 hover:gap-3 group/btn font-bold h-12 rounded-2xl"
                    variant="default"
                >
                    Administrative Hub
                    <Building2 className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-xl border-l-0 shadow-2xl" style={{ minWidth: 'min(95vw, 580px)' }}>
                <div className="mx-auto w-full pt-8 pb-12 space-y-10">
                    <SheetHeader className="pb-6 border-b text-left">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="bg-primary/10 p-2 rounded-xl">
                                <Building2 className="h-5 w-5 text-primary" />
                             </div>
                             <SheetTitle className="text-2xl font-black uppercase tracking-tight">Management Hub</SheetTitle>
                        </div>
                        <SheetDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
                            Configuration panel for <span className="text-primary font-bold italic">{data.name}</span>. Perform administrative updates and staff reassignments.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Section 1: Profile Details */}
                    <BranchProfileForm data={data} onUpdate={handleUpdateBranch} />

                    <Separator className="bg-border/40" />

                    {/* Section 2: Leadership & Authority */}
                    <LeadershipSection data={data} allUsers={allUsers} onReassignManager={handleTransferStaff} />

                    <Separator className="bg-border/40" />

                    {/* Section 3: Staff Management */}
                    <StaffingSection staffList={staffList} onTransfer={handleTransferStaff} />

                    {/* Section 4: Emergency Controls */}
                    <EmergencyControls />
                </div>
            </SheetContent>
        </Sheet>
    )
}
