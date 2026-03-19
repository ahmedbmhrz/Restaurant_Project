import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ManagerCard } from "./ManagerCard"

export function ManagersnBranch({ managers = [], onSelectManager, selectedBranchId }) {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-bold mb-4 flex-none">Branch Managers</h2>
            <ScrollArea className="flex-1 min-h-0 rounded-md border p-4">
                <div className="flex flex-col gap-4">
                    {managers.map((manager, index) => (
                        <ManagerCard 
                            key={index} 
                            {...manager} 
                            onClick={() => onSelectManager && onSelectManager(manager.branch_id)}
                            isSelected={manager.branch_id === selectedBranchId}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>

    )
}

