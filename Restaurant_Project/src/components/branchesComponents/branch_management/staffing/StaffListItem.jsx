import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function StaffListItem({ staff, allBranches = [], onTransfer }) {
    const [isTransferring, setIsTransferring] = useState(false);

    const handleDismiss = () => {
        if (window.confirm(`Are you sure you want to dismiss ${staff.full_name} from this branch?`)) {
            onTransfer(staff.id, null);
        }
    };

    return (
        <div className="group/staff flex items-center justify-between p-2 rounded-xl bg-background/40 border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all duration-300">
            <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9 border border-border/40">
                    <AvatarImage src={staff.avatar_url} />
                    <AvatarFallback className="font-bold text-[10px]">{staff.full_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-xs font-bold tracking-tight">{staff.full_name}</div>
                    <div className="text-[9px] font-medium text-muted-foreground uppercase">{staff.role}</div>
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/staff:opacity-100 transition-opacity">
                {isTransferring ? (
                    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                        <select
                            className="h-7 text-[10px] bg-background border border-primary/30 rounded-lg px-2 font-bold outline-none cursor-pointer hover:border-primary transition-colors"
                            onChange={(e) => {
                                if (e.target.value) {
                                    onTransfer(staff.id, e.target.value);
                                    setIsTransferring(false);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Move to...</option>
                            {allBranches
                                .filter(b => b.id !== staff.branch_id)
                                .map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                        </select>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setIsTransferring(false)}
                        >
                            <span className="text-[10px] font-bold">✕</span>
                        </Button>
                    </div>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] font-black rounded-lg uppercase border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
                            onClick={() => setIsTransferring(true)}
                        >
                            Transfer
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive hover:text-white transition-all"
                            onClick={handleDismiss}
                            title="Dismiss from branch"
                        >
                            <Trash2 className="h-3.5 w-3.5 " />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
