import { Bell, ShoppingBag, Users, AlertTriangle } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverHeader,
    PopoverTitle,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

/**
 * MOCK NOTIFICATIONS
 * Centralizes the recent activity feed for the Notification Center.
 */
const NOTIFICATIONS = [
    {
        id: "n1",
        type: "order",
        title: "Large Order Received",
        description: "Branch A just received a $250.00 order.",
        time: "5m ago",
        status: "success",
        icon: ShoppingBag
    },
    {
        id: "n2",
        type: "staff",
        title: "New Manager Hired",
        description: "Sarah Jenkins joined the Brooklyn branch.",
        time: "1h ago",
        status: "info",
        icon: Users
    },
    {
        id: "n3",
        type: "inventory",
        title: "Low Stock Alert",
        description: "Hamburgers are running low at Branch B.",
        time: "3h ago",
        status: "warning",
        icon: AlertTriangle
    }
];

/**
 * NOTIFICATIONCENTER COMPONENT
 * Renders a feed of recent activity and operational alerts in a popover.
 */
export function NotificationCenter() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors group">
                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    <Badge className="absolute top-1.5 right-1.5 h-4 w-4 flex items-center justify-center p-0 bg-red-500 border-2 border-background text-[10px] font-bold shadow-sm">
                        3
                    </Badge>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden shadow-2xl border-primary/10" align="end">
                <PopoverHeader className="p-4 bg-muted/30 border-b">
                    <PopoverTitle className="text-sm font-bold flex items-center justify-between">
                        Recent Activity
                        <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest bg-white border px-1.5 py-0.5 rounded shadow-sm">Live Updates</span>
                    </PopoverTitle>
                </PopoverHeader>
                <ScrollArea className="h-80">
                    <div className="divide-y">
                        {NOTIFICATIONS.map((n) => (
                            <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-4">
                                <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center shadow-sm
                                    ${n.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                                      n.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                                      'bg-blue-100 text-blue-600'}`}>
                                    <n.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-slate-900 leading-none">{n.title}</p>
                                        <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
