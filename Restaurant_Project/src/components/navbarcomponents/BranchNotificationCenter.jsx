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
import { useState, useEffect } from "react"
import { formatTimeAgo } from "@/lib/utils"

const typeConfig = {
    urgent: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    warning: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
}

export function BranchNotificationCenter({ branchId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const url = branchId ? `/api/notifications?branchId=${branchId}` : '/api/notifications';
            const res = await fetch(url);
            const data = await res.json();
            
            const lastClear = localStorage.getItem('nexus_branch_notif_last_clear');
            const filteredData = lastClear 
                ? data.filter(n => {
                    const isNew = (new Date() - new Date(n.timestamp)) < 120000;
                    return isNew || new Date(n.timestamp) > new Date(lastClear);
                })
                : data;

            setNotifications(filteredData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching branch notifications:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [branchId]);

    const handleClearAll = () => {
        localStorage.setItem('nexus_branch_notif_last_clear', new Date().toISOString());
        setNotifications([]);
    };

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
                        <button 
                            onClick={handleClearAll}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tight"
                        >
                            Clear All
                        </button>
                    </PopoverTitle>
                </PopoverHeader>
                <ScrollArea className="h-80">
                    <div className="divide-y">
                        {loading ? (
                            <div className="p-8 flex justify-center">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No active alerts.</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase">Everything is on track</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
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
                                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{formatTimeAgo(n.timestamp)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
