import { Button } from "@/components/ui/button"
import { Users, UserPlus, X } from "lucide-react"

export function StaffHeader({ count, isAdding, onToggleAdding }) {
    return (
        <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Users className="h-3 w-3" /> Live Staffing ({count})
            </h3>
            {!isAdding ? (
                <Button 
                    onClick={() => onToggleAdding(true)}
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] font-bold uppercase gap-1 hover:bg-primary/5 hover:text-primary animate-in fade-in slide-in-from-right-2"
                >
                    <UserPlus className="h-3 w-3" /> Hire New
                </Button>
            ) : (
                <Button 
                    onClick={() => onToggleAdding(false)}
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] font-bold uppercase gap-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 animate-in fade-in slide-in-from-right-2"
                >
                    <X className="h-3 w-3" /> Cancel
                </Button>
            )}
        </div>
    );
}
