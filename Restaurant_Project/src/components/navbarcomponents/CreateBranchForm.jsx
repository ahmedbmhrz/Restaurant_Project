import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, MapPin, Store, Check, Loader2, AlertCircle } from "lucide-react"

export function CreateBranchForm({ onSuccess }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleCreate = async () => {
        if (!name || !address) return;
        setIsSaving(true);
        setErrorMsg("");
        try {
            const res = await fetch("http://localhost:5000/api/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, address, description }),
            });
            if (res.ok) {
                if (onSuccess) onSuccess();
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Failed to create branch.");
            }
        } catch (err) {
            console.error("Create branch failed:", err);
            setErrorMsg("Network error: Could not reach the server.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1 opacity-70">Branch Name *</Label>
                    <div className="relative">
                        <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                        <input
                            className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                            placeholder="e.g. Downtown Nexus"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1 opacity-70">Physical Address *</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                        <input
                            className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                            placeholder="123 Main St, City"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1 opacity-70">Description</Label>
                    <textarea
                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 transition-all outline-none min-h-[80px] resize-none"
                        placeholder="A brief description of this location..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {errorMsg && (
                <div className="bg-rose-500/10 text-rose-600 text-[11px] font-bold p-3 rounded-xl border border-rose-500/20 flex items-center gap-2 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" /> {errorMsg}
                </div>
            )}

            <Button
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-amber-500/20 bg-amber-600 hover:bg-amber-700 transition-all"
                onClick={handleCreate}
                disabled={isSaving || !name || !address}
            >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                Create Branch
            </Button>
        </div>
    );
}
