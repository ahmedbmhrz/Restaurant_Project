import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, Store, PackagePlus, UserPlus, ChevronDown } from "lucide-react"

import { AddProductForm } from "../branchesComponents/menu_management/AddProductForm"
import { HireStaffForm } from "../branchesComponents/branch_management/staffing/HireStaffForm"
import { CreateBranchForm } from "./CreateBranchForm"

export function QuickActionModal({ actionType, isOpen, onClose }) {
    const [branches, setBranches] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [isLoadingBranches, setIsLoadingBranches] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    useEffect(() => {
        if (isOpen && (actionType === 'product' || actionType === 'staff')) {
            fetchBranches();
        }
        setSelectedBranchId("");
    }, [isOpen, actionType]);

    const fetchBranches = async () => {
        setIsLoadingBranches(true);
        try {
            const res = await fetch("http://localhost:5000/api/");
            const data = await res.json();
            setBranches(data);
            if (data.length > 0) {
                setSelectedBranchId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        } finally {
            setIsLoadingBranches(false);
        }
    };

    const handleSuccess = () => {
        onClose();
        // Dispatch a custom event so active pages can optionally listen and refresh data
        window.dispatchEvent(new Event('quickActionComplete'));
    };

    let title = "";
    let description = "";
    let icon = null;

    if (actionType === 'product') {
        title = "Add New Product";
        description = "Create a new dish for a specific branch menu.";
        icon = <PackagePlus className="h-5 w-5 text-emerald-600" />;
    } else if (actionType === 'staff') {
        title = "Hire New Staff";
        description = "Onboard a new employee to a specific branch.";
        icon = <UserPlus className="h-5 w-5 text-blue-600" />;
    } else if (actionType === 'branch') {
        title = "Create Branch";
        description = "Launch a brand new Nexus Food location.";
        icon = <Store className="h-5 w-5 text-amber-600" />;
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl rounded-3xl p-0">
                <div className="p-8 pb-4 border-b border-slate-100">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl ${
                                actionType === 'product' ? 'bg-emerald-100' :
                                actionType === 'staff' ? 'bg-blue-100' :
                                'bg-amber-100'
                            }`}>
                                {icon}
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-800">{title}</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6 bg-slate-50/50">
                    {/* Branch Selector for context-dependent actions */}
                    {(actionType === 'product' || actionType === 'staff') && (
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase opacity-70 ml-1">Target Branch</Label>
                            {isLoadingBranches ? (
                                <div className="h-12 border border-slate-200 rounded-xl flex items-center px-4 gap-3 text-sm font-medium text-slate-500 bg-white">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading branches...
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                    {branches.map(b => (
                                        <div
                                            key={b.id}
                                            onClick={() => setSelectedBranchId(b.id)}
                                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                                selectedBranchId === b.id 
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="font-bold text-sm truncate">{b.name}</div>
                                            <div className="text-[10px] opacity-70 truncate">{b.address || "Main Branch"}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dynamic Form Rendering */}
                    <div className="pt-2">
                        {actionType === 'product' && selectedBranchId && (
                            <AddProductForm branchId={selectedBranchId} onAddComplete={handleSuccess} />
                        )}
                        {actionType === 'staff' && selectedBranchId && (
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <HireStaffForm branchId={selectedBranchId} onSuccess={handleSuccess} />
                            </div>
                        )}
                        {actionType === 'branch' && (
                            <CreateBranchForm onSuccess={handleSuccess} />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
