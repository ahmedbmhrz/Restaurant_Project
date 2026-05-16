import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Clock } from 'lucide-react';
import { formatTimeAgo } from "@/lib/utils";

export function StaffOnDuty({ onDutyStaff }) {
    return (
        <Card className="h-full bg-white/90 backdrop-blur-xl border-0 shadow-lg rounded-[2rem] overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100/50 bg-slate-50/50 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-800 tracking-tight">
                    <Users className="h-6 w-6 text-indigo-500" />
                    Staff On Duty
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 ml-9">
                    Currently clocked in.
                </CardDescription>
            </CardHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="p-5">
                    {onDutyStaff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Users className="h-12 w-12 opacity-10 mb-4" />
                            <p className="font-bold">No staff on duty</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {onDutyStaff.map((shift, idx) => {
                                const isActive = shift.status === 'Active';
                                return (
                                    <div key={idx} className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-slate-50/50 hover:bg-white border-slate-100/50 hover:border-indigo-100 hover:shadow-md' 
                                        : 'bg-slate-50/20 border-slate-50 opacity-60 grayscale-[0.5]'
                                    }`}>
                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-sm overflow-hidden ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all flex items-center justify-center text-2xl">
                                            {shift.users?.avatar_url ? (
                                                <img src={shift.users.avatar_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                "👤"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-black text-base truncate transition-colors ${isActive ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-500'}`}>
                                                {shift.users?.full_name || 'Unknown Staff'}
                                            </h4>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                {shift.users?.role}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Badge className={`border-0 font-black text-[10px] px-2 py-0.5 rounded-lg ${
                                                isActive 
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                                                : 'bg-slate-200 text-slate-500 hover:bg-slate-200'
                                            }`}>
                                                {isActive ? 'ACTIVE' : (shift.status || 'OFF DUTY').toUpperCase()}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 whitespace-nowrap">
                                                <Clock className="h-3 w-3" />
                                                {isActive 
                                                    ? `In: ${formatTimeAgo(shift.clock_in)}` 
                                                    : (shift.clock_in ? `Out: ${formatTimeAgo(shift.clock_out || shift.clock_in)}` : 'Shift Pending')
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
