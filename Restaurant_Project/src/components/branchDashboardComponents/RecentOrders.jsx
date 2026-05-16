import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ShoppingBag } from 'lucide-react';
import { formatTimeAgo } from "@/lib/utils";

export function RecentOrders({ recentOrders }) {
    return (
        <Card className="h-full bg-white/90 backdrop-blur-xl border-0 shadow-lg rounded-[2rem] overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-800 tracking-tight">
                    <Activity className="h-6 w-6 text-indigo-500" />
                    Live Order Feed
                </CardTitle>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 ml-9">
                    Real-time transaction log
                </p>
            </CardHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="p-0">
                    {recentOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <ShoppingBag className="h-12 w-12 opacity-10 mb-4" />
                            <p className="font-bold">No orders yet today</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="group p-5 hover:bg-slate-50/80 transition-all cursor-default flex items-center justify-between border-l-4 border-transparent hover:border-indigo-500">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${order.order_type === 'Delivery' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <ShoppingBag className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 text-sm">Order #{order.id.split('-')[0].toUpperCase()}</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black uppercase text-slate-400">{order.order_type || 'Takeaway'}</span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-500">{formatTimeAgo(order.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Badge className={`font-black text-[10px] px-2 py-0.5 rounded-lg border-0 ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {order.status}
                                        </Badge>
                                        <div className="text-right min-w-[70px]">
                                            <div className="font-black text-slate-900 text-lg tracking-tight">${(order.total_amount || 0).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
