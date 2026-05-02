import { useState } from "react"
import { ManagerCard } from "./ManagerCard"
import { ManagerProfileModal } from "./ManagerProfileModal"

export function ManagersnBranch({ managers = [], onSelectManager, selectedBranchId }) {
    const [selectedManager, setSelectedManager] = useState(null);

    const handleJumpToBranch = (branchId) => {
        if (onSelectManager) {
            onSelectManager(branchId);
            setSelectedManager(null); // Close modal after jumping
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex-none px-2">Branch Managers</h2>
            <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
                {managers.map((manager, index) => (
                    <ManagerCard 
                        key={index} 
                        {...manager} 
                        onClick={() => onSelectManager && onSelectManager(manager.branch_id)}
                        onProfileClick={() => setSelectedManager(manager)}
                        isSelected={manager.branch_id === selectedBranchId}
                    />
                ))}
            </div>

            <ManagerProfileModal 
                manager={selectedManager}
                isOpen={!!selectedManager}
                onOpenChange={(open) => !open && setSelectedManager(null)}
                onJumpToBranch={() => handleJumpToBranch(selectedManager?.branch_id)}
            />
        </div>
    )
}
