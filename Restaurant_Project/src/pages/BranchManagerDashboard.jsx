import React, { useState, useEffect } from 'react';
import { BranchNavbar } from "@/components/BranchNavbar";
import { supabase } from '../lib/supabase';

// New Sub-components
import { MetricCards } from "@/components/branchDashboardComponents/MetricCards";
import { RecentOrders } from "@/components/branchDashboardComponents/RecentOrders";
import { InventoryAlerts } from "@/components/branchDashboardComponents/InventoryAlerts";
import { StaffOnDuty } from "@/components/branchDashboardComponents/StaffOnDuty";

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

            // 2. Get All Orders (TESTING: Removed Date Filter)
            const { data: orders } = await supabase
                .from('orders')
                .select('id, total_amount, created_at, status, order_type')
                .eq('branch_id', branchId)
                .order('created_at', { ascending: false });

            if (orders && orders.length > 0) {
                setTotalOrders(orders.length);
                setTodaysIncome(orders.reduce((sum, o) => sum + (o.total_amount || 0), 0));
                setRecentOrders(orders.slice(0, 15));
                
                // 3. Get Items Sold
                const orderIds = orders.map(o => o.id);
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select('quantity')
                    .in('order_id', orderIds);
                    
                if (orderItems) {
                    setItemsSold(orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
                }
            } else {
                setTotalOrders(0);
                setTodaysIncome(0);
                setItemsSold(0);
                setRecentOrders([]);
            }

            // 4. Get All Team Members for this branch
            const { data: teamMembers } = await supabase
                .from('users')
                .select('id, full_name, role, avatar_url')
                .eq('branch_id', branchId)
                .neq('role', 'Branch Manager'); // Still filtering out manager
                
            // Also get currently active shifts to mark who is "In"
            const { data: activeShifts } = await supabase
                .from('employee_shifts')
                .select('user_id, clock_in, status')
                .eq('branch_id', branchId)
                .eq('status', 'Active');

            if (teamMembers && teamMembers.length > 0) {
                // Robust filter: Hide anyone with "manager" in their role name
                const staffOnly = teamMembers.filter(member => {
                    const role = (member.role || '').toLowerCase();
                    return !role.includes('manager');
                });

                // Merge staff with their active shift status
                const mergedStaff = staffOnly.map(member => {
                    const activeShift = activeShifts?.find(s => s.user_id === member.id);
                    return {
                        users: member,
                        status: activeShift ? 'Active' : 'Off Duty',
                        clock_in: activeShift?.clock_in || null
                    };
                });
                setOnDutyStaff(mergedStaff);
            } else {
                setOnDutyStaff([]);
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
                setInventoryAlerts([]);
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
                <MetricCards 
                    todaysIncome={todaysIncome}
                    totalOrders={totalOrders}
                    itemsSold={itemsSold}
                />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column (Recent Orders + Alerts) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="h-[600px]">
                            <RecentOrders recentOrders={recentOrders} />
                        </div>
                        <InventoryAlerts inventoryAlerts={inventoryAlerts} />
                    </div>

                    {/* Right Column (Staff) */}
                    <div className="h-[600px]">
                        <StaffOnDuty onDutyStaff={onDutyStaff} />
                    </div>

                </div>
            </main>
        </div>
    );
}

