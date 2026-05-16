import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Clock } from 'lucide-react';
import { formatTimeAgo } from "@/lib/utils";

export function StaffOnDuty({ onDutyStaff }) {
    return (
        <Card className="flex-1 bg-white/80 backdrop-blur border-none shadow-sm rounded-[2rem] overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Staff On Duty
                </CardTitle>
                <CardDescription>Currently clocked in.</CardDescription>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
                {onDutyStaff.length === 0 ? (
                    <div className="text-center text-slate-400 font-medium py-8">No staff currently clocked in.</div>
                ) : (
                    <div className="space-y-4">
                        {onDutyStaff.map((shift, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <div className="h-12 w-12 rounded-xl bg-white shadow-sm overflow-hidden flex items-center justify-center text-xl">
                                    {shift.users?.avatar_url ? (
                                        <img src={shift.users.avatar_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        "👤"
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{shift.users?.full_name || 'Unknown Staff'}</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{shift.users?.role}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">Active</Badge>
                                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTimeAgo(shift.clock_in)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
