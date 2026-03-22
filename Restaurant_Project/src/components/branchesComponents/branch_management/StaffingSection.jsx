import { useState } from "react"

// Modular Staffing Sub-components
import { StaffHeader } from "./staffing/StaffHeader"
import { HireStaffForm } from "./staffing/HireStaffForm"
import { StaffListItem } from "./staffing/StaffListItem"

export function StaffingSection({ staffList, allBranches, onTransfer, branchId, refreshData }) {
    const [isAdding, setIsAdding] = useState(false);

    const handleHireSuccess = () => {
        if (refreshData) refreshData();
        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            <StaffHeader
                count={staffList.length}
                isAdding={isAdding}
                onToggleAdding={setIsAdding}
            />

            {/* Quick Hire Form */}
            {isAdding && (
                <HireStaffForm
                    branchId={branchId}
                    onSuccess={handleHireSuccess}
                />
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {staffList.length > 0 ? staffList.map((staff) => (
                    <StaffListItem
                        key={staff.id}
                        staff={staff}
                        allBranches={allBranches}
                        onTransfer={onTransfer}
                    />
                )) : (
                    <div className="text-center py-10 bg-muted/20 rounded-3xl border border-dashed text-muted-foreground text-xs italic">
                        No active staff records found for this location.
                    </div>
                )}
            </div>
        </div>
    );
}
