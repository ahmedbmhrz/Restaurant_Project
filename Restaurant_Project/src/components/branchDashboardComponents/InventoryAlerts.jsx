import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from 'lucide-react';

export function InventoryAlerts({ inventoryAlerts }) {
    return (
        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-lg rounded-[2rem] overflow-hidden relative">
            {/* Glowing top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-red-500 to-rose-400 opacity-80" />
            
            <CardHeader className="border-b border-rose-100/50 bg-rose-50/50 pb-4 pt-6">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-rose-600 tracking-tight">
                    <div className="relative flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 relative z-10" />
                        <div className="absolute inset-0 bg-rose-400 blur-md opacity-40 rounded-full animate-pulse" />
                    </div>
                    Critical Stock Alerts
                </CardTitle>
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mt-1 ml-9">
                    Requires Immediate Attention
                </p>
            </CardHeader>
            <CardContent className="p-5">
                {inventoryAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-emerald-500">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="font-bold text-lg">All Stock Healthy!</p>
                        <p className="text-sm text-emerald-600/70">No items are below the safety threshold.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inventoryAlerts.map((alert, idx) => {
                            // 20 is the threshold from the Supabase query
                            const isCritical = alert.stock_quantity < 5; 
                            const percentage = (alert.stock_quantity / 20) * 100; 

                            return (
                                <div key={idx} className="group relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {/* Left Accent Line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${isCritical ? 'bg-red-500' : 'bg-amber-400'}`} />
                                    
                                    <div className="flex justify-between items-start ml-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isCritical ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-rose-600 transition-colors">
                                                    {alert.products?.name}
                                                </h4>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>
                                                    {isCritical ? 'Critical Level' : 'Running Low'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <Badge className={`font-black text-xs px-2.5 py-1 text-white border-0 ${isCritical ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`}>
                                            {alert.stock_quantity} Left
                                        </Badge>
                                    </div>

                                    {/* Progress Bar indicator */}
                                    <div className="mt-4 ml-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-amber-400'}`} 
                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
