import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Loader2, AlertCircle } from "lucide-react"

export function HireStaffForm({ branchId, onSuccess, defaultRole = "Waiter", lockedRole = false }) {
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState(defaultRole);
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
                setNewName("");
                onSuccess();
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
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 space-y-3 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase ml-1 opacity-70">Full Name</Label>
                    <input 
                        className="w-full bg-background border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Name..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[9px] font-bold uppercase ml-1 opacity-70">Duty / Role</Label>
                    <select 
                        className={`w-full bg-background border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] font-bold appearance-none outline-none ${lockedRole ? 'opacity-70 bg-slate-50 cursor-not-allowed' : 'cursor-pointer focus:ring-2 focus:ring-primary/20'}`}
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        disabled={lockedRole}
                    >
                        <option value="Waiter">Waiter</option>
                        <option value="Chef">Chef</option>
                        <option value="Branch_Manager">Manager</option>
                        <option value="Host">Host</option>
                        <option value="Security">Security</option>
                    </select>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-rose-500/10 text-rose-600 text-[9px] font-bold p-2 rounded-xl border border-rose-500/20 flex items-center gap-2 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-2.5 w-2.5" /> {errorMsg}
                </div>
            )}

            <Button 
                onClick={handleHire}
                disabled={isSaving || !newName}
                className="w-full h-8 text-[9px] font-black uppercase tracking-widest gap-2 rounded-xl shadow-md shadow-primary/5"
            >
                {isSaving ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                Confirm Hire
            </Button>
        </div>
    );
}
