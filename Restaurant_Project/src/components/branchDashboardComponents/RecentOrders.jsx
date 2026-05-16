import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from 'lucide-react';
import { formatTimeAgo } from "@/lib/utils";

export function RecentOrders({ recentOrders }) {
    return (
        <Card className="flex-1 bg-white/80 backdrop-blur border-none shadow-sm rounded-[2rem] overflow-hidden flex flex-col h-[400px]">
            <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    Recent Orders
                </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="p-0">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium">No orders yet today.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">Order #{order.id.split('-')[0].toUpperCase()}</span>
                                        <span className="text-xs text-slate-500">{order.order_type || 'Takeaway'}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className={`font-bold ${order.status === 'Completed' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                                            {order.status}
                                        </Badge>
                                        <div className="text-right">
                                            <div className="font-black text-slate-800">${(order.total_amount || 0).toFixed(2)}</div>
                                            <div className="text-[10px] text-slate-400">{formatTimeAgo(order.created_at)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
}
