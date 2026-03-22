import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Loader2, AlertCircle } from "lucide-react"

export function HireStaffForm({ branchId, onSuccess }) {
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
    );
}
