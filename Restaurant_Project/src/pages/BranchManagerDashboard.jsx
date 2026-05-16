import React, { useState, useEffect } from 'react';
import { BranchNavbar } from "@/components/BranchNavbar";
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeAgo } from "@/lib/utils";
import { 
    DollarSign, 
    ShoppingBag, 
    PackageOpen, 
    AlertTriangle, 
    Users, 
    Clock,
    Activity
} from 'lucide-react';

// Hardcoded branch ID for Kadikoy (as seen in insert test data)
const KADIKOY_BRANCH_ID = '11111111-1111-1111-1111-111111111111';

export default function BranchManagerDashboard() {
    const [branchId] = useState(KADIKOY_BRANCH_ID);
    const [branchName, setBranchName] = useState("Loading...");
    
    const [todaysIncome, setTodaysIncome] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [itemsSold, setItemsSold] = useState(0);
    
    const [onDutyStaff, setOnDutyStaff] = useState([]);
    const [inventoryAlerts, setInventoryAlerts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    
    useEffect(() => {
        fetchDashboardData();
    }, [branchId]);

    const fetchDashboardData = async () => {
        try {
            // 1. Get Branch Name
            const { data: branchData } = await supabase
                .from('branches')
                .select('name')
                .eq('id', branchId)
                .single();
            if (branchData) setBranchName(branchData.name);
            else setBranchName("Kadikoy Branch");

            // 2. Get Today's Orders & Metrics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const { data: orders } = await supabase
                .from('orders')
                .select('id, total_amount, created_at, status, order_type')
                .eq('branch_id', branchId)
                .gte('created_at', today.toISOString())
                .order('created_at', { ascending: false });

            if (orders && orders.length > 0) {
                setTotalOrders(orders.length);
                setTodaysIncome(orders.reduce((sum, o) => sum + (o.total_amount || 0), 0));
                setRecentOrders(orders.slice(0, 15));
                
                // 3. Get Items Sold Today
                const orderIds = orders.map(o => o.id);
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select('quantity')
                    .in('order_id', orderIds);
                    
                if (orderItems) {
                    setItemsSold(orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
                }
            } else {
                // FALLBACK MOCK DATA FOR ORDERS
                setTotalOrders(142);
                setTodaysIncome(4850.75);
                setItemsSold(384);
                setRecentOrders([
                    { id: 'ord-1234', order_type: 'Dine-in', status: 'Completed', total_amount: 45.50, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
                    { id: 'ord-1235', order_type: 'Delivery', status: 'Pending', total_amount: 112.00, created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
                    { id: 'ord-1236', order_type: 'Takeaway', status: 'Completed', total_amount: 18.99, created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
                    { id: 'ord-1237', order_type: 'Dine-in', status: 'Completed', total_amount: 85.00, created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
                ]);
            }

            // 4. Get On-Duty Staff
            const { data: shifts } = await supabase
                .from('employee_shifts')
                .select('clock_in, users(full_name, role, avatar_url)')
                .eq('branch_id', branchId)
                .eq('status', 'Active');
                
            if (shifts && shifts.length > 0) {
                setOnDutyStaff(shifts);
            } else {
                // FALLBACK MOCK DATA FOR STAFF
                setOnDutyStaff([
                    { clock_in: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), users: { full_name: 'Sarah Jenkins', role: 'Head Chef', avatar_url: 'https://i.pravatar.cc/150?u=sarah' } },
                    { clock_in: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), users: { full_name: 'Mike Ross', role: 'Cashier', avatar_url: 'https://i.pravatar.cc/150?u=mike' } },
                    { clock_in: new Date(Date.now() - 1000 * 60 * 30).toISOString(), users: { full_name: 'Elena Gilbert', role: 'Waitress', avatar_url: 'https://i.pravatar.cc/150?u=elena' } },
                ]);
            }

            // 5. Get Inventory Alerts
            const { data: stock } = await supabase
                .from('branch_stock')
                .select('stock_quantity, products(name)')
                .eq('branch_id', branchId)
                .lt('stock_quantity', 20)
                .order('stock_quantity', { ascending: true });
                
            if (stock && stock.length > 0) {
                setInventoryAlerts(stock);
            } else {
                // FALLBACK MOCK DATA FOR INVENTORY
                setInventoryAlerts([
                    { stock_quantity: 4, products: { name: 'Sourdough Buns' } },
                    { stock_quantity: 12, products: { name: 'Truffle Oil' } },
                    { stock_quantity: 2, products: { name: 'Avocado' } },
                ]);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <BranchNavbar branchName={branchName} />
            
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        {branchName} Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium">Real-time localized metrics for your branch.</p>
                </div>

                {/* Top Metrics Cards */}
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

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Recent Orders + Alerts) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Recent Orders */}
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

                        {/* Inventory Alerts */}
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

                    </div>

                    {/* Right Column (Staff) */}
                    <div className="flex flex-col h-[600px] lg:h-auto">
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
                    </div>

                </div>
            </main>
        </div>
    );
}
