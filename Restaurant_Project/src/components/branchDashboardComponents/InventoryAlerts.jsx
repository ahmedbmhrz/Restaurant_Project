import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from 'lucide-react';

export function InventoryAlerts({ inventoryAlerts }) {
    return (
        <Card className="bg-white/80 backdrop-blur border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-rose-50/30 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alerts
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {inventoryAlerts.length === 0 ? (
                    <div className="text-center text-emerald-600 font-bold py-4">All stock levels are healthy!</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inventoryAlerts.map((alert, idx) => (
                            <div key={idx} className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex justify-between items-center">
                                <span className="font-bold text-slate-700 text-sm">{alert.products?.name}</span>
                                <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs">
                                    {alert.stock_quantity} left
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
