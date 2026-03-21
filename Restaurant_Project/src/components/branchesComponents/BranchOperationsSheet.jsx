import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Activity, AlertCircle, Save, UserPlus, Users, MapPin, Pencil, ShieldCheck } from "lucide-react"

export function BranchOperationsSheet({ data, staffList = [], allUsers = [] }) {
    const [name, setName] = useState(data.name || "");
    const [address, setAddress] = useState(data.address || "");
    const [description, setDescription] = useState(data.description || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setName(data.name || "");
        setAddress(data.address || "");
        setDescription(data.description || "");
    }, [data]);

    const handleUpdateBranch = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/branches/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, description })
            });
            if (res.ok) {
                // In a real app, I'd trigger a page-level re-fetch here
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Failed to update branch:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleTransferStaff = async (userId, newBranchId, newRole = null) => {
        try {
            await fetch(`http://localhost:5000/api/users/${userId}/branch`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branch_id: newBranchId, role: newRole })
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to transfer staff:", error);
        }
    };

    if (!data) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="w-full transition-all duration-300 hover:gap-3 group/btn font-bold h-12 rounded-2xl"
                    variant="default"
                >
                    Administrative Hub
                    <Building2 className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-xl border-l-0 shadow-2xl" style={{ minWidth: 'min(95vw, 580px)' }}>
                <div className="mx-auto w-full pt-8 pb-12 space-y-10">
                    <SheetHeader className="pb-6 border-b text-left">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="bg-primary/10 p-2 rounded-xl">
                                <Building2 className="h-5 w-5 text-primary" />
                             </div>
                             <SheetTitle className="text-2xl font-black uppercase tracking-tight">Management Hub</SheetTitle>
                        </div>
                        <SheetDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
                            Configuration panel for <span className="text-primary font-bold italic">{data.name}</span>. Perform administrative updates and staff reassignments.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Section 1: Profile Details */}
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
                                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
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
                                        className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Full address..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold uppercase ml-1">Description</Label>
                                <textarea 
                                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Branch biography..."
                                />
                            </div>
                            <Button 
                                onClick={handleUpdateBranch}
                                disabled={isSaving}
                                className="w-full h-11 font-bold rounded-xl gap-2 mt-2 shadow-lg shadow-primary/10"
                            >
                                <Save className="h-4 w-4" />
                                Save Profile Updates
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-border/40" />

                    {/* Section 2: Leadership & Authority */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" /> Leadership & Authority
                        </h3>
                        
                        <div className="bg-primary/5 p-5 rounded-3xl border border-primary/10">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold uppercase ml-1">Assign Primary Manager</Label>
                                <select 
                                    className="w-full bg-background/80 border border-primary/20 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                                    defaultValue={data.manager_id}
                                    onChange={(e) => handleTransferStaff(e.target.value, data.id, "Manager")}
                                >
                                    <option value="">Select a manager...</option>
                                    {allUsers.map(user => (
                                        <option key={user.id} value={user.id}>{user.full_name} ({user.role})</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-muted-foreground mt-2 px-1 leading-relaxed italic">
                                    Changing the primary manager will immediately update the Leadership profile in the branch header.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-border/40" />

                    {/* Section 3: Staff Management */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <Users className="h-3 w-3" /> Live Staffing ({staffList.length})
                            </h3>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase gap-1 hover:bg-primary/5 hover:text-primary">
                                <UserPlus className="h-3 w-3" /> Hire New
                            </Button>
                        </div>

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
                                            onClick={() => handleTransferStaff(staff.id, null)} // In a real app, I'd show a branch selector
                                        >
                                            Transfer
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-muted/20 rounded-3xl border border-dashed text-muted-foreground text-xs italic">
                                    No staff records found for this location.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Live Ops Toggle (Existing) */}
                    <div className="space-y-6 pt-6 border-t">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> Emergency Controls
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/30 p-4 transition-all hover:shadow-md cursor-default">
                                <div className="space-y-0.5 pr-4">
                                    <Label className="text-sm font-bold text-rose-900">Block New Orders</Label>
                                    <p className="text-[11px] text-rose-600/70 font-medium">Pause all incoming digital traffic immediately.</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-rose-600" />
                            </div>

                            <Button variant="destructive" className="w-full h-12 text-xs font-black rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.15)] hover:bg-rose-600 transition-all uppercase tracking-widest">
                                Shutdown Branch Instance
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
