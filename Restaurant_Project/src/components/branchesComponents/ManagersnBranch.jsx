import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { ManagerCard } from "./ManagerCard"
import { ManagerProfileModal } from "./ManagerProfileModal"

export function ManagersnBranch({ managers = [], onSelectManager, selectedBranchId }) {
    const [selectedManager, setSelectedManager] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleJumpToBranch = (branchId) => {
        if (onSelectManager) {
            onSelectManager(branchId);
            setSelectedManager(null); // Close modal after jumping
        }
    };

    const filteredManagers = useMemo(() => {
        return managers.filter(m => {
            const term = searchTerm.toLowerCase();
            const nameMatch = (m.name || "").toLowerCase().includes(term);
            const branchMatch = (m.branchName || "").toLowerCase().includes(term);
            return nameMatch || branchMatch;
        });
    }, [managers, searchTerm]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-none px-2 mb-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Branch Managers</h2>
                
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        className="w-full bg-white/60 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none shadow-sm"
                        placeholder="Search name or branch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredManagers.length > 0 ? (
                    filteredManagers.map((manager, index) => (
                        <ManagerCard 
                            key={index} 
                            {...manager} 
                            onClick={() => onSelectManager && manager.branch_id && onSelectManager(manager.branch_id)}
                            onProfileClick={() => setSelectedManager(manager)}
                            isSelected={manager.branch_id === selectedBranchId && !!manager.branch_id}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                        No managers found.
                    </div>
                )}
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
