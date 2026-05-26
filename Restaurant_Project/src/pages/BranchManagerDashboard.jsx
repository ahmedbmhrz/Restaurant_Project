import React, { useState, useEffect } from 'react';
import { BranchNavbar } from "@/components/BranchNavbar";
import { supabase } from '../lib/supabase';

// New Sub-components
import { MetricCards } from "@/components/branchDashboardComponents/MetricCards";
import { RecentOrders } from "@/components/branchDashboardComponents/RecentOrders";
import { InventoryAlerts } from "@/components/branchDashboardComponents/InventoryAlerts";
import { StaffOnDuty } from "@/components/branchDashboardComponents/StaffOnDuty";
import { TestOrderModal } from "@/components/branchDashboardComponents/TestOrderModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Hardcoded branch ID fallback for legacy mode
const KADIKOY_BRANCH_ID = '11111111-1111-1111-1111-111111111111';

export default function BranchManagerDashboard() {
    const [branchId, setBranchId] = useState(null);
    const [branchName, setBranchName] = useState("Loading...");
    const [isTestOrderModalOpen, setIsTestOrderModalOpen] = useState(false);
    
    const [todaysIncome, setTodaysIncome] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [itemsSold, setItemsSold] = useState(0);
    
    const [onDutyStaff, setOnDutyStaff] = useState([]);
    const [inventoryAlerts, setInventoryAlerts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    
    // Resolve active branch context from logged-in manager's profile
    useEffect(() => {
        const resolveBranch = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const { data: dbUser } = await supabase
                        .from('users')
                        .select('branch_id')
                        .eq('id', session.user.id)
                        .maybeSingle();
                        
                    if (dbUser?.branch_id) {
                        setBranchId(dbUser.branch_id);
                        return;
                    }
                }
                // Fallback to Kadikoy Central
                setBranchId(KADIKOY_BRANCH_ID);
            } catch (e) {
                console.error("Failed to resolve branch context:", e);
                setBranchId(KADIKOY_BRANCH_ID);
            }
        };
        resolveBranch();
    }, []);

    // Set up real-time subscriptions and data fetching on branchId resolve
    useEffect(() => {
        if (!branchId) return;
        
        fetchDashboardData();

        // 🟢 Set up Supabase Real-time Subscriptions for Live Mode
        const channel = supabase
            .channel('dashboard-changes')
            // Listen for new/updated orders
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchDashboardData();
            })
            // Listen for staff clocking in/out
            .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_shifts' }, () => {
                fetchDashboardData();
            })
            // Listen for inventory stock changes
            .on('postgres_changes', { event: '*', schema: 'public', table: 'branch_stock' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        // Cleanup subscription when leaving the page
        return () => {
            supabase.removeChannel(channel);
        };
    }, [branchId]);

    const fetchDashboardData = async () => {
        if (!branchId) return;
        try {
            // 1. Get Branch Name
            const { data: branchData } = await supabase
                .from('branches')
                .select('name')
                .eq('id', branchId)
                .single();
            if (branchData) setBranchName(branchData.name);
            else setBranchName("Branch Store");

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

    if (!branchId) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-6 animate-pulse text-white">
                    <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Unlocking Branch Terminal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <BranchNavbar branchName={branchName} branchId={branchId} />
            
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            {branchName} Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium">Real-time localized metrics for your branch.</p>
                    </div>
                    <Button 
                        onClick={() => setIsTestOrderModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 font-bold tracking-wide shadow-md shadow-indigo-200 gap-2"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Create Test Order
                    </Button>
                </div>

                {/* Top Metrics Cards */}
                <MetricCards 
                    todaysIncome={todaysIncome}
                    totalOrders={totalOrders}
                    itemsSold={itemsSold}
                />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Top Row: Orders and Staff */}
                    <div className="lg:col-span-2 h-[600px]">
                        <RecentOrders recentOrders={recentOrders} />
                    </div>

                    <div className="lg:col-span-1 h-[600px]">
                        <StaffOnDuty onDutyStaff={onDutyStaff} />
                    </div>

                    {/* Bottom Row: Full Width Alerts */}
                    <div className="lg:col-span-3">
                        <InventoryAlerts inventoryAlerts={inventoryAlerts} />
                    </div>

                </div>
            </main>
            
            <TestOrderModal 
                isOpen={isTestOrderModalOpen}
                onOpenChange={setIsTestOrderModalOpen}
                branchId={branchId}
                branchName={branchName}
            />
        </div>
    );
}
