import { Label } from "@/components/ui/label"
import { ShieldCheck } from "lucide-react"

export function LeadershipSection({ data, allUsers, onReassignManager }) {
    return (
        <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Leadership & Authority
            </h3>
            
            <div className="bg-primary/5 p-5 rounded-3xl border border-primary/10">
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Assign Primary Manager</Label>
                    <select 
                        className="w-full bg-background/80 border border-primary/20 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer outline-none"
                        defaultValue={data.manager_id}
                        onChange={(e) => onReassignManager(e.target.value, data.id, "Manager")}
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
    );
}
