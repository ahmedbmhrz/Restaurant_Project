import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { ManagerCard } from "./ManagerCard"
import { ManagerProfileModal } from "./ManagerProfileModal"

export function ManagersnBranch({ managers = [], branches = [], onSelectManager, selectedBranchId }) {
    const [selectedManager, setSelectedManager] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("managers");

    const handleJumpToBranch = (branchId) => {
        if (onSelectManager) {
            onSelectManager(branchId);
            setSelectedManager(null);
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

    const filteredBranches = useMemo(() => {
        return branches.filter(b => {
            const term = searchTerm.toLowerCase();
            const nameMatch = (b.name || "").toLowerCase().includes(term);
            const addressMatch = (b.address || "").toLowerCase().includes(term);
            return nameMatch || addressMatch;
        });
    }, [branches, searchTerm]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-none px-2 mb-4 space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Directory</h2>
                
                <div className="flex bg-slate-100/50 p-1 rounded-xl">
                    <button 
                        className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${viewMode === 'managers' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setViewMode('managers')}
                    >
                        Managers
                    </button>
                    <button 
                        className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${viewMode === 'branches' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setViewMode('branches')}
                    >
                        All Branches
                    </button>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        className="w-full bg-white/60 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none shadow-sm"
                        placeholder={viewMode === 'managers' ? "Search managers..." : "Search branches..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-slate-200">
                {viewMode === 'managers' && (
                    filteredManagers.length > 0 ? (
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
                    )
                )}

                {viewMode === 'branches' && (
                    filteredBranches.length > 0 ? (
                        filteredBranches.map((branch, index) => {
                            const branchManager = managers.find(m => m.branch_id === branch.id);
                            return (
                                <div 
                                    key={index}
                                    onClick={() => onSelectManager && onSelectManager(branch.id)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                        branch.id === selectedBranchId 
                                            ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500/20' 
                                            : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-sm text-slate-800 truncate pr-2">{branch.name}</h3>
                                        {branch.id === selectedBranchId && (
                                            <span className="flex-shrink-0 text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mb-2">{branch.address}</p>
                                    <div className="text-[10px] font-medium flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${branchManager ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                                        <span className={branchManager ? 'text-slate-600' : 'text-slate-400 italic'}>
                                            {branchManager ? `Managed by ${branchManager.name}` : 'No Manager Assigned'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                            No branches found.
                        </div>
                    )
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
