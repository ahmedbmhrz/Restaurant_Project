import { useState, useEffect } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog"
import { Bell, AlertCircle, CheckCircle2, Info, Clock, Search, Filter, Trash2, CheckCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const typeConfig = {
    urgent: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    warning: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

const formatFullTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

export function NotificationsModal({ isOpen, onOpenChange, notifications: initialNotifications }) {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState(initialNotifications);

    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    const filteredNotifications = notifications.filter(notif => {
        const matchesFilter = filter === "all" || notif.type === filter;
        const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             notif.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const clearAll = () => setNotifications([]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden bg-white/95 backdrop-blur-2xl border-none shadow-2xl rounded-[2.5rem]">
                
                {/* Header Section */}
                <div className="p-8 pb-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Notification Center</DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium">Manage all your system alerts and activities</DialogDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearAll}
                                className="text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search notifications..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-100/50 border-none rounded-xl focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-full sm:w-auto">
                            {["all", "urgent", "warning", "info"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        filter === f 
                                        ? "bg-white text-indigo-600 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                    {filteredNotifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                            <div className="p-6 bg-slate-100 rounded-full text-slate-300">
                                <CheckCheck className="h-12 w-12" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
                                <p className="text-sm text-slate-400 max-w-[250px]">No notifications match your current filters or search criteria.</p>
                            </div>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => {
                            const config = typeConfig[notif.type] || typeConfig.info;
                            const Icon = config.icon;
                            return (
                                <div 
                                    key={notif.id}
                                    className={`group flex gap-5 p-5 rounded-3xl border ${config.border} bg-white transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer`}
                                >
                                    <div className={`shrink-0 h-12 w-12 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                {notif.title}
                                            </h3>
                                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-400 bg-slate-50 uppercase tracking-tighter">
                                                {notif.type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            {notif.description}
                                        </p>
                                        <div className="flex items-center gap-2 pt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Clock className="h-3 w-3" />
                                            {formatFullTime(notif.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                    <Button 
                        onClick={() => onOpenChange(false)}
                        className="bg-slate-900 hover:bg-black text-white px-8 rounded-2xl font-bold h-12"
                    >
                        Close Center
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
