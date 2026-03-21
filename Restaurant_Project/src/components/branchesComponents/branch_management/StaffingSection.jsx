import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Users, UserPlus, X, Check, Loader2, AlertCircle } from "lucide-react"

export function StaffingSection({ staffList, onTransfer, branchId }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("Waiter");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleHire = async () => {
        if (!newName) return;
        setIsSaving(true);
        setErrorMsg("");
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: newName,
                    role: newRole,
                    branch_id: branchId
                })
            });
            
            if (res.ok) {
                window.location.reload();
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Failed to hire staff member.");
            }
        } catch (error) {
            console.error("Hiring failed:", error);
            setErrorMsg("Network error: Could not reach the server.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Users className="h-3 w-3" /> Live Staffing ({staffList.length})
                </h3>
                {!isAdding ? (
                    <Button 
                        onClick={() => setIsAdding(true)}
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[10px] font-bold uppercase gap-1 hover:bg-primary/5 hover:text-primary animate-in fade-in slide-in-from-right-2"
                    >
                        <UserPlus className="h-3 w-3" /> Hire New
                    </Button>
                ) : (
                    <Button 
                        onClick={() => setIsAdding(false)}
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[10px] font-bold uppercase gap-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 animate-in fade-in slide-in-from-right-2"
                    >
                        <X className="h-3 w-3" /> Cancel
                    </Button>
                )}
            </div>

            {/* Quick Hire Form */}
            {isAdding && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase ml-1">Full Name</Label>
                            <input 
                                className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Employee name..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase ml-1">Duty / Role</Label>
                            <select 
                                className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="Waiter">Waiter / Server</option>
                                <option value="Chef">Chef / Kitchen</option>
                                <option value="Manager">Assistant Manager</option>
                                <option value="Host">Host / Reception</option>
                                <option value="Security">Security / Safety</option>
                            </select>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-rose-500/10 text-rose-600 text-[10px] font-bold p-2.5 rounded-xl border border-rose-500/20 flex items-center gap-2 animate-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3" /> {errorMsg}
                        </div>
                    )}

                    <Button 
                        onClick={handleHire}
                        disabled={isSaving || !newName}
                        className="w-full h-9 text-[10px] font-black uppercase tracking-widest gap-2 rounded-xl shadow-lg shadow-primary/10"
                    >
                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Confirm Hire Instance
                    </Button>
                </div>
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {staffList.length > 0 ? staffList.map((staff) => (
                    <div key={staff.id} className="group/staff flex items-center justify-between p-3 rounded-2xl bg-background/40 border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border/40">
                                <AvatarImage src={staff.avatar_url} />
                                <AvatarFallback className="font-bold text-xs">{staff.full_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm font-bold tracking-tight">{staff.full_name}</div>
                                <div className="text-[10px] font-medium text-muted-foreground uppercase">{staff.role}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover/staff:opacity-100 transition-opacity">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-[10px] font-black rounded-lg uppercase"
                                onClick={() => onTransfer(staff.id, null)} 
                            >
                                Transfer
                            </Button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 bg-muted/20 rounded-3xl border border-dashed text-muted-foreground text-xs italic">
                        No active staff records found for this location.
                    </div>
                )}
            </div>
        </div>
    );
}
