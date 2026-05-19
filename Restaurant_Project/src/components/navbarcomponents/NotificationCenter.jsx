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

export function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    // Live update ticker (every minute)
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            // Use relative path so it works across different environments/IPs
            const res = await fetch('/api/notifications');
            const data = await res.json();
            
            // Filtering logic: only show notifications that haven't been 'cleared'
            // We use the last clear timestamp to filter out old news
            const lastClear = localStorage.getItem('nexus_notifications_last_clear');
            const filteredData = lastClear 
                ? data.filter(n => {
                    // If the notification is very recent (within last 2 mins), always show it
                    // even if it's slightly before the 'clear' time, to account for clock drift
                    const isNew = (new Date() - new Date(n.timestamp)) < 120000;
                    return isNew || new Date(n.timestamp) > new Date(lastClear);
                })
                : data;

            setNotifications(filteredData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleGlobalAction = () => fetchNotifications();
        window.addEventListener('quickActionComplete', handleGlobalAction);
        
        return () => {
            window.removeEventListener('quickActionComplete', handleGlobalAction);
        };
    }, []);

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
            <PopoverContent className="w-[420px] p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-primary/10 rounded-3xl" align="end">
                <PopoverHeader className="p-5 bg-slate-50/50 border-b border-slate-100">
                    <PopoverTitle className="text-base font-extrabold flex items-center justify-between text-slate-800">
                        Recent Activity
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] bg-primary/10 px-3 py-1 rounded-full shadow-sm">Live Updates</span>
                    </PopoverTitle>
                </PopoverHeader>
                <ScrollArea className="h-[420px]">
                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center text-sm font-bold text-slate-500">No new alerts.</div>
                        ) : (
                            notifications.map((n) => {
                                const config = typeConfig[n.type] || typeConfig.info;
                                const Icon = config.icon;

                                return (
                                    <div key={n.id} className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-4">
                                        <div className={`mt-0.5 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ${config.bg} ${config.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-black text-slate-800 leading-tight">{n.title}</p>
                                                <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap ml-2">{formatTimeAgo(n.timestamp)}</span>
                                            </div>
                                            <p className="text-[13px] font-medium text-slate-500 leading-relaxed pr-2">{n.description}</p>
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
