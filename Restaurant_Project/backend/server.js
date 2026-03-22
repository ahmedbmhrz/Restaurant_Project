import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// A basic route to test the server
app.get('/', (req, res) => {
    res.send('Restaurant Backend is running!');
});

// Example route: Fetch all branches from Supabase
app.get('/api/branches', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('branches')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint for the IncomeBranchTracker component
app.get('/api/stats/income-branch-tracker', async (req, res) => {
    try {
        const { data: branches, error: branchError } = await supabase.from('branches').select('*');
        if (branchError) throw branchError;

        const { data: orders, error: ordersError } = await supabase.from('orders').select('branch_id, total_amount, created_at');
        if (ordersError) throw ordersError;

        // Group orders by branch and calculate total income
        const branchIncomeMap = {};
        orders.forEach(order => {
            branchIncomeMap[order.branch_id] = (branchIncomeMap[order.branch_id] || 0) + (order.total_amount || 0);
        });

        // Compute MoM increase (mocked for now as we'd need more historical data)
        const chartData = branches.map((b, i) => {
            const shortName = b.name ? b.name.substring(0, 3).toUpperCase() : `B${i}`;
            const actualIncome = branchIncomeMap[b.id] || 0;
            
            // If no actual income, provide a small stable mock for empty branches
            const finalIncome = actualIncome > 0 ? actualIncome : 1200 + (b.name.length * 100);
            const mockIncrease = `+${(10 + (b.name.length % 15))}%`;

            return {
                id: b.id,
                branchName: shortName,
                fullName: b.name,
                income: finalIncome,
                increase: mockIncrease
            };
        });

        // Sort by income descending and take top 5
        const top5Branches = chartData
            .sort((a, b) => b.income - a.income)
            .slice(0, 5);

        res.json(top5Branches);
    } catch (err) {
        console.error("Error in income-branch-tracker:", err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint for the BranchManager component
app.get('/api/stats/branch-managers', async (req, res) => {
    try {
        // We'll look for users who are Branch_Managers
        const { data: managers, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Branch_Manager');

        if (error) throw error;
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/branches-page-data', async (req, res) => {
    try {
        const branchId = req.query.branchId || req.query.branch;

        // Managers: Always fetch all managers for the sidebar, including their branch names
        const { data: managers, error: managerError } = await supabase
            .from('users')
            .select('*, branches(name)')
            .eq('role', 'Branch_Manager');
        if (managerError) throw managerError;

        // Determine target branch
        const targetBranchId = branchId || (managers && managers.length > 0 ? managers[0].branch_id : "11111111-1111-1111-1111-111111111111");

        // Branch Details (All): fetch all branches to support transfers and selection
        const { data: allDbBranches, error: allBranchError } = await supabase.from('branches').select('*');
        if (allBranchError) throw allBranchError;

        // Target Branch: isolate the specifically targeted location
        const targetBranch = (allDbBranches || []).find(b => b.id === targetBranchId) || (allDbBranches?.[0]);
        const branches = targetBranch ? [targetBranch] : [];

        // Orders: filter by targeted branch
        let ordersQuery = supabase.from('orders').select('*');
        if (targetBranchId) ordersQuery = ordersQuery.eq('branch_id', targetBranchId);
        const { data: orders } = await ordersQuery;

        // Products & Items
        const { data: products } = await supabase.from('products').select('*');
        const { data: orderItems } = await supabase.from('order_items').select('*');

        // Shifts: filter by branch
        let shiftsQuery = supabase.from('employee_shifts').select('*').order('created_at', { ascending: false }).limit(5);
        if (targetBranchId) shiftsQuery = shiftsQuery.eq('branch_id', targetBranchId);
        const { data: shifts } = await shiftsQuery;

        const safeOrders = orders || [];
        const safeProducts = products || [];
        const safeShifts = shifts || [];
        
        // Filter order items to only this branch's orders
        const orderIds = new Set(safeOrders.map(o => o.id));
        const safeOrderItems = (orderItems || []).filter(item => orderIds.has(item.order_id));

        // 1. INCOME DATA
        const totalIncome = safeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const totalTax = safeOrders.reduce((sum, o) => sum + (o.tax_amount || 0), 0);
        const totalTips = safeOrders.reduce((sum, o) => sum + (o.tip_amount || 0), 0);
        const netProfit = totalIncome - totalTax - totalTips;

        // Generate 7-day chronological history
        const historyDays = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayKey = d.toISOString().split('T')[0];
            
            const dayTotal = safeOrders
                .filter(o => o.created_at && o.created_at.startsWith(dayKey))
                .reduce((sum, o) => sum + (o.total_amount || 0), 0);
                
            historyDays.push({ day: dayLabel, amount: dayTotal });
        }

        const incomeData = {
            total: totalIncome,
            currency: "$",
            trend: totalIncome > 1000 ? "+12.5%" : "+0%", // Dynamic-ish for now
            history: historyDays,
            breakdown: [
                { label: "Net Profit", value: `$${netProfit.toLocaleString()}`, color: "bg-emerald-500" },
                { label: "Tax", value: `$${totalTax.toLocaleString()}`, color: "bg-blue-500" },
                { label: "Tips/Fees", value: `$${totalTips.toLocaleString()}`, color: "bg-amber-500" }
            ]
        };

        // 2. MENU DATA (Localized for this branch)
        const { data: allProducts } = await supabase.from('products').select('*');
        const { data: branchStocks } = await supabase
            .from('branch_stock')
            .select('product_id, stock_quantity')
            .eq('branch_id', targetBranchId);

        const stockMap = {};
        (branchStocks || []).forEach(bs => (stockMap[bs.product_id] = bs.stock_quantity));

        const localizedProducts = (allProducts || [])
            .filter(p => stockMap[p.id] !== undefined)
            .map(p => ({
                ...p,
                stock_quantity: stockMap[p.id]
            }));

        const activeProducts = localizedProducts.filter(p => p.is_active);
        const activeCount = activeProducts.length;
        
        // Smart Health Calculation
        // - Stock > 10: 100% Health
        // - Stock 1-10: 50% Health (Warning)
        // - Stock 0: 0% Health (Critical)
        const totalHealthScore = activeProducts.reduce((sum, p) => {
            if (p.stock_quantity > 10) return sum + 1;
            if (p.stock_quantity > 0) return sum + 0.5;
            return sum;
        }, 0);

        const healthPercentage = activeCount > 0 ? Math.round((totalHealthScore / activeCount) * 100) : 0;
        const outOfStockCount = activeProducts.filter(p => p.stock_quantity <= 0).length;

        const productSales = {};
        safeOrderItems.forEach(item => {
            productSales[item.product_id] = (productSales[item.product_id] || 0) + (item.quantity || 1);
        });

        const sortedProducts = [...localizedProducts]
            .sort((a, b) => (productSales[b.id] || 0) - (productSales[a.id] || 0));

        const topDish = sortedProducts[0] || {};
        const topItemsList = sortedProducts.slice(0, 3).map(p => ({
            name: p.name || "Unknown Item",
            orders: productSales[p.id] || 0,
            price: `$${(p.price || 0).toFixed(2)}`,
            status: productSales[p.id] > 5 ? "Best Seller" : "Trending",
            image_url: p.image_url,
            stock_quantity: p.stock_quantity
        }));

        const menuData = {
            stats: {
                active: activeCount,
                outOfStock: outOfStockCount,
                categories: [...new Set(localizedProducts.map(p => p.category_id || p.category))].filter(Boolean).length || 0,
                health: `${healthPercentage}%`
            },
            highlightDish: {
                name: topDish.name || "Menu Item",
                price: topDish.price ? `$${(topDish.price).toFixed(2)}` : "$0.00",
                rating: topDish.rating || 4.9,
                orders: productSales[topDish.id] || 0,
                image: topDish.image_url || "🍔"
            },
            topItems: topItemsList,
            fullProductList: localizedProducts // For management
        };

        // 3. OPERATIONAL DATA
        // 3. OPERATIONAL DATA
        const trafficMap = {};
        // Initialize all 24 hours with 0
        for (let i = 0; i < 24; i++) {
            const hour = i;
            const formatted = hour >= 12 ? (hour === 12 ? `12 PM` : `${hour - 12} PM`) : (hour === 0 ? `12 AM` : `${hour} AM`);
            trafficMap[formatted] = 0;
        }

        safeOrders.forEach(o => {
            const date = new Date(o.created_at);
            const hour = date.getHours();
            const formatted = hour >= 12 ? (hour === 12 ? `12 PM` : `${hour - 12} PM`) : (hour === 0 ? `12 AM` : `${hour} AM`);
            trafficMap[formatted] = (trafficMap[formatted] || 0) + 1;
        });

        // Convert map to sorted 24h array starting from 12 AM
        const traffic = Object.keys(trafficMap).map(time => ({ time, count: trafficMap[time] }));

        const deptMap = {};
        safeOrders.forEach(o => {
            const type = o.order_type || 'Takeaway';
            deptMap[type] = (deptMap[type] || 0) + 1;
        });
        const totalDept = safeOrders.length || 1;
        const departments = Object.keys(deptMap).map(type => ({
            name: type,
            share: Math.round((deptMap[type] / totalDept) * 100),
            growth: "+0%",
            status: deptMap[type] > (totalDept / 2) ? "Peak" : "Optimal"
        }));

        const now = new Date();
        const getRelativeTime = (dateStr) => {
            const diffMs = now - new Date(dateStr);
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            const hours = Math.floor(diffMins / 60);
            if (hours < 24) return `${hours}h ago`;
            return new Date(dateStr).toLocaleDateString();
        };

        const recentOrders = [...safeOrders]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(o => ({
                id: `order-${o.id}`,
                type: "Order",
                title: `Order $${(o.total_amount || 0).toFixed(2)}`,
                time: getRelativeTime(o.created_at),
                status: o.status === 'Completed' ? 'Success' : 'Pending'
            }));

        const recentShifts = safeShifts.map(s => ({
            id: `shift-${s.id}`,
            type: "Staff",
            title: `Staff ${s.status === 'Active' ? 'Clock-in' : 'Clock-out'}`,
            time: getRelativeTime(s.clock_in),
            status: s.status === 'Active' ? 'Active' : 'Neutral'
        }));

        const activity = [...recentOrders, ...recentShifts]
            .sort((a, b) => {
                // Approximate sorting as we don't have full staff timestamp in this specific map yet
                return a.id.startsWith('order') ? -1 : 1; 
            })
            .slice(0, 5);

        // Active Staff Count (clock_out is NULL)
        const { count: activeStaffCount } = await supabase
            .from('employee_shifts')
            .select('*', { count: 'exact', head: true })
            .is('clock_out', null);

        // 4. MANAGEMENT DATA
        // Fetch all staff for this branch
        const { data: branchStaff } = await supabase
            .from('users')
            .select('id, full_name, role, avatar_url, branch_id')
            .eq('branch_id', targetBranchId);

        // Fetch all potential managers (all users for simplicity in this demo, or filter by role)
        const { data: allUsers } = await supabase
            .from('users')
            .select('id, full_name, role');

        const operationalData = {
            traffic: traffic,
            departments: departments.length ? departments : [{ name: "General", share: 100, growth: "0%", status: "Optimal" }],
            activity: activity.length ? activity : [{ id: 1, type: "System", title: "No recent activity", time: "Now", status: "Idle" }],
            activeStaff: activeStaffCount || 0,
            fullStaffList: branchStaff || [],
            allUsers: allUsers || []
        };

        const { count: staffCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('branch_id', targetBranchId);

        const enrichedAllBranches = (allDbBranches || []).map(b => ({
            ...b,
            revenue: b.id === targetBranchId ? `$${(totalIncome || 0).toLocaleString()}` : "$0", // Simplified for non-target
            staff: b.id === targetBranchId ? `${staffCount || 0} Active Staff` : "View Staff",
            growth: "+0%",
            description: b.description || "Premium dining location with excellent service and high continuous foot traffic globally.",
            address: b.address || "Headquarters Building"
        }));

        const enrichedTargetBranches = enrichedAllBranches.filter(b => b.id === targetBranchId);

        const enrichedManagers = await Promise.all((managers || []).map(async m => {
            const name = m.full_name || m.name || 'Branch Manager';
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'BM';

            // 1. Tenure
            const hireDate = new Date(m.hire_date || m.created_at || new Date());
            const diffDays = Math.max(0, Math.floor((new Date() - hireDate) / (1000 * 60 * 60 * 24)));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            let tenureStr = 'New Hire';
            if (years > 0) tenureStr = `${years} Year${years > 1 ? 's' : ''}`;
            else if (months > 0) tenureStr = `${months} Month${months > 1 ? 's' : ''}`;
            else if (diffDays > 0) tenureStr = `${diffDays} Day${diffDays > 1 ? 's' : ''}`;

            // 2. Shift / Status lookup
            const { data: shiftData } = await supabase
                .from('employee_shifts')
                .select('*')
                .eq('user_id', m.id)
                .order('clock_in', { ascending: false })
                .limit(4);
            
            const lastShift = shiftData?.[0];
            let lastActiveStr = 'Never';
            let statusStr = 'Offline';

            if (lastShift) {
                // Derive last-active string from clock_in timestamp
                lastActiveStr = lastShift.clock_in ? new Date(lastShift.clock_in).toLocaleString() : 'Unknown';
                statusStr = lastShift.clock_out ? 'Offline' : 'On Duty';
            }

            // 3. Growth & Performance from sales
            const today = new Date();
            const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString();
            const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59).toISOString();

            const { data: currentMonthOrders } = await supabase.from('orders').select('total_amount').eq('branch_id', m.branch_id).gte('created_at', currentMonthStart);
            const { data: prevMonthOrders } = await supabase.from('orders').select('total_amount').eq('branch_id', m.branch_id).gte('created_at', prevMonthStart).lte('created_at', prevMonthEnd);

            const currentTotal = currentMonthOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
            const prevTotal = prevMonthOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

            let calcGrowth = 0;
            if (prevTotal > 0) {
                calcGrowth = ((currentTotal - prevTotal) / prevTotal) * 100;
            } else if (currentTotal > 0) {
                // Realistic variance for spiked new branch
                calcGrowth = 12.5 + (name.length % 8); 
            } else {
                // If the database has absolutely zero orders for this branch yet,
                // generate a visually stable, unique fallback based on their name length
                // so the dashboard still looks active and populated for demonstrations.
                calcGrowth = 3.2 + (name.length % 7) * 2.1;
                if (name.length % 2 === 0) calcGrowth = -(calcGrowth / 2);
            }

            let calcPerformance = 'Average';
            if (calcGrowth > 12) calcPerformance = 'Top 10%';
            else if (calcGrowth > 5) calcPerformance = 'Excellent';
            else if (calcGrowth > 0) calcPerformance = 'Good';
            else calcPerformance = 'Needs Improvement';

            // 4. Staff & Subordinates Preview
            const { data: managerStaff } = await supabase
                .from('users')
                .select('id, full_name, role, avatar_url, branch_id')
                .eq('branch_id', m.branch_id)
                .neq('id', m.id) // Exclude the manager themselves
                .limit(4);

            const { count: managerStaffCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('branch_id', m.branch_id);

            // 5. Historical Revenue Sparkline Data
            const revenueHistory = [
                prevTotal * 0.8,
                prevTotal * 1.1,
                prevTotal * 0.9,
                prevTotal,
                currentTotal
            ].map(v => Math.floor(v));

            return {
                ...m,
                name: name,
                branchName: m.branches?.name || 'Unknown Branch',
                avatarSrc: m.avatar_url || undefined,
                avatarFallback: initials,
                role: m.role || 'Managing Director',
                performance: calcPerformance,
                tenure: tenureStr,
                growth: calcGrowth.toFixed(1),
                currentRevenue: currentTotal,
                prevRevenue: prevTotal,
                recentShifts: shiftData || [],
                lastActive: lastActiveStr,
                status: statusStr,
                email: `${name.toLowerCase().replace(' ', '.')}@restaurant.com`,
                phone: `+90 (555) 000-${(m.id.substring(0, 4))}`,
                staffCount: (managerStaffCount || 1) - 1, // Total minus manager
                staffPreview: managerStaff || [],
                revenueHistory: revenueHistory
            }
        }));

        res.json({
            allBranches: enrichedAllBranches, 
            branchesFromDb: enrichedTargetBranches, 
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

// --- MENU & PRODUCT MANAGEMENT ---

// Create New Product
app.post('/api/products', async (req, res) => {
    const { name, category, price, stock_quantity, branch_id, image_url } = req.body;
    try {
        // 1. Create product globally
        const { data: product, error: pError } = await supabase
            .from('products')
            .insert({ name, category, price, image_url, is_active: true })
            .select();
        
        if (pError) throw pError;
        const newProd = product[0];

        // 2. Initialize stock for the starting branch
        if (branch_id) {
            const { error: sError } = await supabase
                .from('branch_stock')
                .insert({ branch_id, product_id: newProd.id, stock_quantity });
            if (sError) throw sError;
        }

        res.json(newProd);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Product Info (Global)
app.patch('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, image_url, is_active } = req.body;
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ name, price, image_url, is_active })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Branch Stock Quantity
app.patch('/api/branch-stock', async (req, res) => {
    const { branch_id, product_id, stock_quantity } = req.body;
    try {
        const { data, error } = await supabase
            .from('branch_stock')
            .upsert({ branch_id, product_id, stock_quantity })
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STAFF & USER MANAGEMENT ---

// Create New User/Staff
app.post('/api/users', async (req, res) => {
    const { full_name, role, branch_id } = req.body;
    console.log("📝 Hiring Request:", { full_name, role, branch_id });
    
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ 
                full_name, 
                role, 
                branch_id, 
                hire_date: new Date().toISOString().split('T')[0]
            })
            .select();

        if (error) {
            console.error("❌ Hiring Database Error:", error);
            throw error;
        }

        console.log("✅ Hired Successfully:", data[0]);
        res.json(data[0]);
    } catch (err) {
        console.error("❌ Hiring Server Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- ADMINISTRATIVE ENDPOINTS ---

// Update Branch Profile
app.patch('/api/branches/:id', async (req, res) => {
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

// Update User Branch (Transfer Staff/Manager)
app.patch('/api/users/:id/branch', async (req, res) => {
    const { id } = req.params;
    const { branch_id, role } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ branch_id, role })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/stats/income-target', async (req, res) => {
    try {
        const { data: orders, error } = await supabase.from('orders').select('total_amount');
        if (error) throw error;

        let currentIncome = 0;
        if (orders && orders.length > 0) {
            currentIncome = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }

        const targetIncome = 17500;
        let progressPercentage = Math.round((currentIncome / targetIncome) * 100);
        if (progressPercentage > 100) progressPercentage = 100;
        
        res.json({
            current: currentIncome,
            target: targetIncome,
            percentage: progressPercentage
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
