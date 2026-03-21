import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"

export function StaffingSection({ staffList, onTransfer }) {
    return (
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
                                onClick={() => onTransfer(staff.id, null)} 
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
    );
}
