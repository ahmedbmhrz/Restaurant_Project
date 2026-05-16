import { Bell, AlertCircle, CheckCircle2, Info, Clock } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverHeader,
    PopoverTitle,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

const typeConfig = {
    urgent: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    warning: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
}

export function BranchNotificationCenter() {
    // Hardcoded mock notifications exclusively for the Branch Manager
    const [notifications] = useState([
        {
            id: 'mock-1',
            title: "🚨 DIRECTIVE FROM HQ",
            description: "ATTN Branch Manager: Severe storm approaching. Ensure all outdoor patio seating is secured and closed by 4:00 PM today.",
            timestamp: "Just now",
            type: "urgent"
        },
        {
            id: 'mock-2',
            title: "Inventory Alert",
            description: "Your stock of 'Truffle Oil' is extremely low (12 units remaining).",
            timestamp: "12m ago",
            type: "warning"
        },
        {
            id: 'mock-3',
            title: "Staffing Notice",
            description: "Sarah Jenkins (Head Chef) has requested a shift change for tomorrow.",
            timestamp: "1h ago",
            type: "info"
        },
        {
            id: 'mock-4',
            title: "Daily Target Met",
            description: "Congratulations! You have surpassed the $4,500 daily revenue target.",
            timestamp: "3h ago",
            type: "success"
        }
    ]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors group">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    {notifications.length > 0 && (
                        <Badge className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center p-0 bg-red-500 border-2 border-background text-[10px] font-bold shadow-sm">
                            {notifications.length}
                        </Badge>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden shadow-2xl border-primary/10" align="end">
                <PopoverHeader className="p-4 bg-muted/30 border-b">
                    <PopoverTitle className="text-sm font-bold flex items-center justify-between">
                        Branch Alerts
                        <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest bg-white border px-1.5 py-0.5 rounded shadow-sm">Local Mock</span>
                    </PopoverTitle>
                </PopoverHeader>
                <ScrollArea className="h-80">
                    <div className="divide-y">
                        {notifications.map((n) => {
                            const config = typeConfig[n.type] || typeConfig.info;
                            const Icon = config.icon;

                            return (
                                <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-4">
                                    <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${config.bg} ${config.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{n.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
