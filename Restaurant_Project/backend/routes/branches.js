import express from 'express';
import supabase from '../supabaseClient.js';
import { getRelativeTime } from '../utils/time.js';

/**
 * BRANCHES ROUTER
 * This module handles all branch-specific business logic, including 
 * global branch discovery, profile updates, and the complex data 
 * aggregation required for the Branch Insights dashboard.
 */
const router = express.Router();

/**
 * GET /api/
 * Fetches the basic metadata for all registered branches in the system.
 */
router.get('/', async (req, res) => {
    try {
        const { data: branches, error: bError } = await supabase.from('branches').select('*');
        if (bError) throw bError;

        const { data: managers, error: mError } = await supabase
            .from('users')
            .select('id, full_name, role, branch_id')
            .in('role', ['Branch_Manager', 'Manager']);
        if (mError) throw mError;
        
        const transformedData = branches.map(branch => {
            const manager = (managers || []).find(m => m.branch_id === branch.id);
            return {
                ...branch,
                hasManager: !!manager,
                managerName: manager ? manager.full_name : null
            };
        });

        res.json(transformedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/
 */
router.post('/', async (req, res) => {
    const { name, address, description } = req.body;
    try {
        const { data, error } = await supabase
            .from('branches')
            .insert([{ name, address, description }])
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /api/:id
 */
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, description } = req.body;
    try {
        const { data, error } = await supabase
            .from('branches')
            .update({ name, address, description })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/branches-page-data
 */
router.get('/branches-page-data', async (req, res) => {
    try {
        const branchId = req.query.branchId || req.query.branch;

        // --- STEP 1: INITIAL DATA FETCHING ---
        const { data: managers, error: managerError } = await supabase
            .from('users')
            .select('*, branches(name)')
            .in('role', ['Branch_Manager', 'Manager']);
        if (managerError) throw managerError;

        const targetBranchId = branchId || (managers && managers.length > 0 ? managers[0].branch_id : "11111111-1111-1111-1111-111111111111");

        const { data: allDbBranches, error: allBranchError } = await supabase.from('branches').select('*');
        if (allBranchError) throw allBranchError;

        const targetBranch = (allDbBranches || []).find(b => b.id === targetBranchId) || (allDbBranches?.[0]);
        
        let ordersQuery = supabase.from('orders').select('*');
        if (targetBranchId) ordersQuery = ordersQuery.eq('branch_id', targetBranchId);
        const { data: orders } = await ordersQuery;

        const { data: products } = await supabase.from('products').select('*');
        const { data: orderItems } = await supabase.from('order_items').select('*');

        let shiftsQuery = supabase.from('employee_shifts').select('*').order('created_at', { ascending: false }).limit(10);
        if (targetBranchId) shiftsQuery = shiftsQuery.eq('branch_id', targetBranchId);
        const { data: shifts } = await shiftsQuery;

        const safeOrders = orders || [];
        const safeProducts = products || [];
        const safeShifts = shifts || [];
        
        const orderIds = new Set(safeOrders.map(o => o.id));
        const safeOrderItems = (orderItems || []).filter(item => orderIds.has(item.order_id));

        // --- STEP 2: REVENUE & TRENDS ---
        const today = new Date();
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

        const currentMonthTotal = safeOrders
            .filter(o => new Date(o.created_at) >= startOfThisMonth)
            .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const lastMonthTotal = safeOrders
            .filter(o => {
                const d = new Date(o.created_at);
                return d >= startOfLastMonth && d <= endOfLastMonth;
            })
            .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const last7DaysStart = new Date();
        last7DaysStart.setDate(last7DaysStart.getDate() - 7);
        const last7DaysOrders = safeOrders.filter(o => o.created_at && new Date(o.created_at) >= last7DaysStart);

        const totalIncome = last7DaysOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        
        let totalTax = last7DaysOrders.reduce((sum, o) => sum + (o.tax_amount || 0), 0);
        if (totalTax === 0 && totalIncome > 0) {
            totalTax = totalIncome * 0.08;
        }

        let totalTips = last7DaysOrders.reduce((sum, o) => sum + (o.tip_amount || 0), 0);
        if (totalTips === 0 && totalIncome > 0) {
            totalTips = totalIncome * 0.10;
        }

        const netProfit = totalIncome - totalTax - totalTips;

        const historyDays = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = d.toLocaleDateString('sv-SE');
            const dayTotal = safeOrders
                .filter(o => {
                    if (!o.created_at) return false;
                    const orderDateStr = new Date(o.created_at).toLocaleDateString('sv-SE');
                    return orderDateStr === dayKey;
                })
                .reduce((sum, o) => sum + (o.total_amount || 0), 0);
            historyDays.push({ day: dayLabel, amount: dayTotal });
        }

        const incomeTrend = lastMonthTotal > 0 
            ? `${(((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)}%` 
            : currentMonthTotal > 0 ? "+100%" : "+0%";

        const incomeData = {
            total: totalIncome,
            currency: "$",
            trend: incomeTrend, 
            history: historyDays,
            breakdown: [
                { label: "Net Profit", value: `$${Math.round(netProfit).toLocaleString()}`, color: "bg-emerald-500" },
                { label: "Tax", value: `$${Math.round(totalTax).toLocaleString()}`, color: "bg-blue-500" },
                { label: "Tips/Fees", value: `$${Math.round(totalTips).toLocaleString()}`, color: "bg-amber-500" }
            ]
        };

        // --- STEP 3: MENU & INVENTORY ---
        const { data: branchStocks } = await supabase.from('branch_stock').select('*').eq('branch_id', targetBranchId);
        const stockMap = {};
        (branchStocks || []).forEach(bs => (stockMap[bs.product_id] = bs.stock_quantity));

        const localizedProducts = safeProducts
            .filter(p => stockMap[p.id] !== undefined)
            .map(p => ({ ...p, stock_quantity: stockMap[p.id] }));

        const activeProducts = localizedProducts.filter(p => p.is_active);
        const outOfStockCount = activeProducts.filter(p => p.stock_quantity <= 0).length;
        const totalHealthScore = activeProducts.reduce((sum, p) => p.stock_quantity > 10 ? sum + 1 : (p.stock_quantity > 0 ? sum + 0.5 : sum), 0);
        const healthPercentage = activeProducts.length > 0 ? Math.round((totalHealthScore / activeProducts.length) * 100) : 0;

        const productSales = {};
        safeOrderItems.forEach(item => { productSales[item.product_id] = (productSales[item.product_id] || 0) + (item.quantity || 1); });
        const sortedProducts = [...localizedProducts].sort((a, b) => (productSales[b.id] || 0) - (productSales[a.id] || 0));
        const topDish = sortedProducts[0] || {};
        const topItemsList = sortedProducts.slice(0, 3).map(p => ({
            name: p.name || "Item",
            orders: productSales[p.id] || 0,
            price: `$${(p.price || 0).toFixed(2)}`,
            status: productSales[p.id] > 5 ? "Best Seller" : "Trending",
            image_url: p.image_url,
            stock_quantity: p.stock_quantity
        }));

        const menuData = {
            stats: {
                active: activeProducts.length,
                outOfStock: outOfStockCount,
                categories: [...new Set(localizedProducts.map(p => p.category_id || p.category))].filter(Boolean).length || 0,
                health: `${healthPercentage}%`
            },
            highlightDish: {
                name: topDish.name || "Menu Item",
                price: topDish.price ? `$${(topDish.price).toFixed(2)}` : "$0.00",
                orders: productSales[topDish.id] || 0,
                image: topDish.image_url || "🍔",
                rating: topDish.rating || 4.5
            },
            topItems: topItemsList,
            fullProductList: localizedProducts 
        };

        // --- STEP 4: TRAFFIC & FEED ---
        const trafficMap = {};
        for (let i = 0; i < 24; i++) {
            const formatted = i >= 12 ? (i === 12 ? `12 PM` : `${i - 12} PM`) : (i === 0 ? `12 AM` : `${i} AM`);
            trafficMap[formatted] = 0;
        }
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        safeOrders.forEach(o => {
            const orderDate = new Date(o.created_at);
            if (orderDate >= startOfToday) {
                const hour = orderDate.getHours();
                const formatted = hour >= 12 ? (hour === 12 ? `12 PM` : `${hour - 12} PM`) : (hour === 0 ? `12 AM` : `${hour} AM`);
                trafficMap[formatted]++;
            }
        });
        const traffic = Object.keys(trafficMap).map(time => ({ time, count: trafficMap[time] }));

        const deptMap = {};
        safeOrders.forEach(o => { const type = o.order_type || 'Takeaway'; deptMap[type] = (deptMap[type] || 0) + 1; });
        const departments = Object.keys(deptMap).map(type => ({
            name: type,
            share: Math.round((deptMap[type] / (safeOrders.length || 1)) * 100),
            growth: "+0%",
            status: deptMap[type] > (safeOrders.length / 2) ? "Peak" : "Optimal"
        }));

        const activity = [
            ...safeOrders.map(o => ({
                id: `o-${o.id}`,
                type: "Order",
                title: `${o.order_type || 'New'} Order`,
                description: `Invoice for $${(o.total_amount || 0).toLocaleString()} via ${o.payment_method || 'Credit Card'}`,
                timestamp: new Date(o.created_at).getTime(),
                time: getRelativeTime(o.created_at),
                status: "Success"
            })),
            ...safeShifts.map(s => ({
                id: `s-${s.id}`,
                type: "Staff",
                title: `Shift Update`,
                description: `Personnel ${s.status === 'Active' ? 'Clocked In' : 'Clocked Out'} for duty`,
                timestamp: new Date(s.clock_in).getTime(),
                time: getRelativeTime(s.clock_in),
                status: "Active"
            }))
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

        const { count: activeStaffCount } = await supabase.from('employee_shifts').select('*', { count: 'exact', head: true }).is('clock_out', null).eq('branch_id', targetBranchId);

        const { data: branchStaff } = await supabase.from('users').select('*').eq('branch_id', targetBranchId);
        const { data: allUsers } = await supabase.from('users').select('*');

        const operationalData = {
            traffic, departments, activity,
            activeStaff: activeStaffCount || 0,
            fullStaffList: branchStaff || [],
            allUsers: allUsers || []
        };

        // --- STEP 5: ENRICHED DATA ---
        const enrichedAllBranches = allDbBranches.map(b => ({
            ...b,
            revenue: b.id === targetBranchId ? `$${totalIncome.toLocaleString()}` : "$0",
            staff: b.id === targetBranchId ? `${branchStaff?.length || 0} Staff` : "View",
            growth: b.id === targetBranchId ? incomeTrend : "+0%",
            description: b.description || "Premium dining location.",
            address: b.address || "Main Street"
        }));

        const enrichedManagers = await Promise.all(managers.map(async m => {
            const hireDate = new Date(m.hire_date || m.created_at);
            const diffDays = Math.max(0, Math.floor((new Date() - hireDate) / (1000 * 60 * 60 * 24)));
            const tenureStr = diffDays > 365 ? `${Math.floor(diffDays/365)} Years` : `${Math.floor(diffDays/30)} Months`;

            return {
                ...m,
                name: m.full_name,
                branchName: m.branches?.name || 'Unassigned',
                avatarFallback: (m.full_name || 'BM').split(' ').map(n => n[0]).join('').toUpperCase(),
                performance: incomeTrend.includes('-') ? 'Needs Review' : 'Good',
                tenure: tenureStr,
                growth: incomeTrend.replace('+', '').replace('%', ''),
                revenueHistory: historyDays.map(d => d.amount)
            };
        }));

        res.json({
            allBranches: enrichedAllBranches,
            branchesFromDb: enrichedAllBranches.filter(b => b.id === targetBranchId),
            managers: enrichedManagers,
            targetBranchId,
            incomeData,
            menuData,
            operationalData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
