import { Bell, AlertCircle, CheckCircle2, Info, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const typeConfig = {
    urgent: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    warning: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

export function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/notifications');
                const data = await res.json();
                setNotifications(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Bell className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Live Updates</h2>
                        <p className="text-xs font-medium text-slate-500">System & Branch Alerts</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:bg-primary/5">
                    Mark all read
                </Button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="flex flex-col gap-3 pr-2 pb-2">
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center py-8">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                            <p className="text-sm font-bold text-slate-500">Loading alerts...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <p className="text-sm font-bold text-slate-500 text-center py-8">No new alerts.</p>
                    ) : (
                        notifications.map((notification) => {
                            const config = typeConfig[notification.type] || typeConfig.info;
                            const Icon = config.icon;

                            return (
                                <div 
                                    key={notification.id}
                                    className={`group relative flex gap-4 p-4 rounded-2xl border ${config.border} bg-white/60 hover:bg-white transition-all hover:shadow-md cursor-pointer overflow-hidden shrink-0`}
                                >
                                    {/* Left Color Accent */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} transition-all group-hover:w-1.5`} />

                                    <div className={`mt-0.5 shrink-0 ${config.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-bold text-slate-800 leading-none">
                                                {notification.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed pr-6">
                                            {notification.description}
                                        </p>
                                    </div>

                                    {/* Hover Action Arrow */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
            
            {/* View All Footer */}
            <div className="p-3 border-t border-slate-200/50 bg-slate-50/50 mt-auto">
                <Button variant="ghost" className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 h-8">
                    View All Notifications
                </Button>
            </div>
        </div>
    )
}
