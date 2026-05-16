import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, PackageOpen } from 'lucide-react';

export function MetricCards({ todaysIncome, totalOrders, itemsSold }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income */}
            <Card className="bg-white/80 backdrop-blur border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Today's Income</CardTitle>
                    <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-slate-800">${todaysIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>

            {/* Orders */}
            <Card className="bg-white/80 backdrop-blur border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Total Orders</CardTitle>
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-slate-800">{totalOrders}</div>
                </CardContent>
            </Card>

            {/* Items Sold */}
            <Card className="bg-white/80 backdrop-blur border-none shadow-sm hover:shadow-md transition-all rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Items Sold</CardTitle>
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                        <PackageOpen className="h-5 w-5" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-slate-800">{itemsSold}</div>
                </CardContent>
            </Card>
        </div>
    );
}
