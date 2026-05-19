import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, MapPin, Store, Check, Loader2, AlertCircle, Copy } from "lucide-react"

export function CreateBranchForm({ onSuccess }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [createdBranch, setCreatedBranch] = useState(null);
    const [copied, setCopied] = useState(false);

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
                const data = await res.json();
                setCreatedBranch(data);
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

    const handleCopy = () => {
        if (createdBranch?.access_code) {
            navigator.clipboard.writeText(createdBranch.access_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (createdBranch) {
        return (
            <div className="bg-amber-500/5 border border-amber-500/10 p-8 rounded-[2rem] space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto h-16 w-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-md">
                    <Check className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-800">Branch Registered!</h3>
                    <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">
                        Share this secure one-time activation code with your Branch Manager to activate their terminal.
                    </p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-inner relative group">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Branch Access Code
                    </span>
                    <span className="text-3xl font-black tracking-widest text-amber-600 select-all font-mono">
                        {createdBranch.access_code}
                    </span>
                </div>
                
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-xl font-bold text-xs uppercase gap-2"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied!" : "Copy Code"}
                    </Button>
                    <Button
                        className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs uppercase"
                        onClick={() => {
                            if (onSuccess) onSuccess();
                        }}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

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
