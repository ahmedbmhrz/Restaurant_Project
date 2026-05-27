import React, { useState, useEffect } from 'react';
import { BranchNavbar } from "@/components/BranchNavbar";
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useLiveQuery } from "dexie-react-hooks";
import { OfflineSyncManager } from "@/components/OfflineSyncManager";

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
    const [companyId, setCompanyId] = useState(null);
    const [branchName, setBranchName] = useState("Loading...");
    const [isTestOrderModalOpen, setIsTestOrderModalOpen] = useState(false);
    
    // Using Dexie for POS-critical offline data
    const orders = useLiveQuery(() => branchId ? db.orders.where('branch_id').equals(branchId).reverse().sortBy('created_at') : [], [branchId]);
    const orderItems = useLiveQuery(() => db.orderItems.toArray(), []);
    const stock = useLiveQuery(() => branchId ? db.branchStock.where('branch_id').equals(branchId).toArray() : [], [branchId]);
    const products = useLiveQuery(() => db.products.toArray(), []);
    
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
                        .select('branch_id, company_id')
                        .eq('id', session.user.id)
                        .maybeSingle();
                        
                    if (dbUser?.branch_id) {
                        setBranchId(dbUser.branch_id);
                        setCompanyId(dbUser.company_id);
                        return;
                    }
                    
                    // Fallback: If HQ Admin, get their first branch
                    if (dbUser?.company_id) {
                        const { data: firstBranch } = await supabase
                            .from('branches')
                            .select('id, company_id')
                            .eq('company_id', dbUser.company_id)
                            .limit(1)
                            .maybeSingle();
                            
                        if (firstBranch) {
                            setBranchId(firstBranch.id);
                            setCompanyId(firstBranch.company_id);
                            return;
                        }
                    }
                }
                
                // Absolute fallback if everything fails
                const { data: absoluteFallback } = await supabase.from('branches').select('id, company_id').limit(1).maybeSingle();
                if (absoluteFallback) {
                    setBranchId(absoluteFallback.id);
                    setCompanyId(absoluteFallback.company_id);
                } else {
                    setBranchId(KADIKOY_BRANCH_ID); // Empty DB
                }
            } catch (e) {
                console.error("Failed to resolve branch context:", e);
            }
        };
        resolveBranch();
    }, []);

    // Set up Real-time computations from Dexie
    useEffect(() => {
        if (orders) {
            setTotalOrders(orders.length);
            setTodaysIncome(orders.reduce((sum, o) => sum + (o.total_amount || 0), 0));
            setRecentOrders(orders.slice(0, 15));
            
            if (orderItems) {
                const orderIds = new Set(orders.map(o => o.id));
                const filteredItems = orderItems.filter(item => orderIds.has(item.order_id));
                setItemsSold(filteredItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
            }
        }

        if (stock && products) {
            const mappedStock = stock
                .map(s => {
                    const product = products.find(p => p.id === s.product_id);
                    return {
                        ...s,
                        products: { name: product?.name || 'Unknown' }
                    };
                })
                .sort((a, b) => a.stock_quantity - b.stock_quantity);
            setInventoryAlerts(mappedStock);
        }
    }, [orders, orderItems, stock, products]);

    // Set up real-time subscriptions and data fetching on branchId resolve (for non-offline data)
    useEffect(() => {
        if (!branchId) return;
        
        fetchStaffData();
        fetchBranchName();

        // 🟢 Set up Supabase Real-time Subscriptions for Live Mode (staff only)
        const channel = supabase
            .channel('dashboard-staff')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_shifts' }, () => {
                fetchStaffData();
            })
            .subscribe();

        // Cleanup subscription when leaving the page
        return () => {
            supabase.removeChannel(channel);
        };
    }, [branchId]);

    const fetchBranchName = async () => {
        const { data: branchData } = await supabase.from('branches').select('name').eq('id', branchId).maybeSingle();
        if (branchData) setBranchName(branchData.name);
    };

    const fetchStaffData = async () => {
        if (!branchId) return;
        try {
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
        } catch (error) {
            console.error("Error fetching staff data:", error);
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
                        Create Order
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

            <OfflineSyncManager branchId={branchId} companyId={companyId} />
        </div>
    );
}
