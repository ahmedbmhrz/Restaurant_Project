import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Pencil, MapPin, Save } from "lucide-react"

export function BranchProfileForm({ data, onUpdate }) {
    const [name, setName] = useState(data.name || "");
    const [address, setAddress] = useState(data.address || "");
    const [description, setDescription] = useState(data.description || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setName(data.name || "");
        setAddress(data.address || "");
        setDescription(data.description || "");
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        await onUpdate({ name, address, description });
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Pencil className="h-3 w-3" /> Branch Profile
                </h3>
                {isSaving && <span className="text-[10px] font-bold text-amber-500 animate-pulse">Saving Changes...</span>}
            </div>
            
            <div className="space-y-4 bg-muted/30 p-5 rounded-3xl border border-border/40">
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Branch Name</Label>
                    <input 
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter branch name..."
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Physical Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/40" />
                        <input 
                            className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Full address..."
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Description</Label>
                    <textarea 
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Branch biography..."
                    />
                </div>
                <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-11 font-bold rounded-xl gap-2 mt-2 shadow-lg shadow-primary/10"
                >
                    <Save className="h-4 w-4" />
                    Save Profile Updates
                </Button>
            </div>
        </div>
    );
}
