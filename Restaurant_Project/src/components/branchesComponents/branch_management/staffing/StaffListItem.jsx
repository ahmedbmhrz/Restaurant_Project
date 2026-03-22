import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function StaffListItem({ staff, onTransfer }) {
    return (
        <div className="group/staff flex items-center justify-between p-3 rounded-2xl bg-background/40 border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all duration-300">
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
    );
}
