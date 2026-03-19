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
        const { data: branches, error } = await supabase.from('branches').select('*');
        if (error) throw error;

        // Map real branches to our needed charting structure
        // Since we don't have real "income" in DB yet, we'll randomize it slightly
        // to show how it connects to real branch names.
        const chartData = branches.map((b, i) => {
            // Take the first letter or short name of the branch to fit on X-Axis
            const shortName = b.name ? b.name.substring(0, 3).toUpperCase() : `B${i}`;
            const mockIncome = 3000 + (Math.floor(Math.random() * 5000));
            const mockIncrease = `+${Math.floor(Math.random() * 20)}%`;
            return {
                id: b.id,
                branchName: shortName,
                fullName: b.name,
                income: mockIncome,
                increase: mockIncrease
            };
        });

        res.json(chartData);
    } catch (err) {
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
        const { data: branches, error: branchError } = await supabase.from('branches').select('*');
        if (branchError) throw branchError;

        const { data: managers, error: managerError } = await supabase.from('users').select('*').eq('role', 'Branch_Manager');
        if (managerError) throw managerError;
        
        // Fetch new real data
        const { data: orders } = await supabase.from('orders').select('*');
        const { data: products } = await supabase.from('products').select('*');
        const { data: orderItems } = await supabase.from('order_items').select('*');
        const { data: shifts } = await supabase.from('employee_shifts').select('*').order('created_at', { ascending: false }).limit(5);

        const safeOrders = orders || [];
        const safeProducts = products || [];
        const safeOrderItems = orderItems || [];
        const safeShifts = shifts || [];

        // 1. INCOME DATA
        const totalIncome = safeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const totalTax = safeOrders.reduce((sum, o) => sum + (o.tax_amount || 0), 0);
        const totalTips = safeOrders.reduce((sum, o) => sum + (o.tip_amount || 0), 0);
        const netProfit = totalIncome - totalTax - totalTips;

        const historyMap = {};
        safeOrders.forEach(o => {
            const day = new Date(o.created_at).toLocaleDateString('en-US', { weekday: 'short' });
            historyMap[day] = (historyMap[day] || 0) + (o.total_amount || 0);
        });
        const history = Object.keys(historyMap).map(day => ({ day, amount: historyMap[day] }));

        const incomeData = {
            total: totalIncome,
            currency: "$",
            trend: "+0%", // Static unless past data compared
            history: history.length ? history : [{ day: "Mon", amount: 0 }],
            breakdown: [
                { label: "Net Profit", value: `$${netProfit.toLocaleString()}`, color: "bg-emerald-500" },
                { label: "Tax", value: `$${totalTax.toLocaleString()}`, color: "bg-blue-500" },
                { label: "Tips/Fees", value: `$${totalTips.toLocaleString()}`, color: "bg-amber-500" }
            ]
        };

        // 2. MENU DATA
        const activeCount = safeProducts.filter(p => p.is_active).length;
        const outOfStockCount = safeProducts.filter(p => p.is_active && p.stock_quantity === 0).length;

        const productSales = {};
        safeOrderItems.forEach(item => {
            productSales[item.product_id] = (productSales[item.product_id] || 0) + (item.quantity || 1);
        });

        const sortedProducts = safeProducts
            .filter(p => productSales[p.id])
            .sort((a, b) => productSales[b.id] - productSales[a.id]);

        const topDish = sortedProducts[0] || safeProducts[0] || {};
        const topItemsList = sortedProducts.slice(0, 3).map(p => ({
            name: p.name,
            orders: productSales[p.id] || 0,
            price: `$${p.price || 0}`,
            status: "Popular"
        }));

        const menuData = {
            stats: {
                active: activeCount,
                outOfStock: outOfStockCount,
                categories: [...new Set(safeProducts.map(p => p.category_id))].length || 0,
                health: activeCount > 0 ? `${Math.round(((activeCount - outOfStockCount) / activeCount) * 100)}%` : "0%"
            },
            highlightDish: {
                name: topDish.name || "No Orders Yet",
                price: topDish.price ? `$${topDish.price}` : "$0",
                rating: topDish.rating || 5.0,
                orders: productSales[topDish.id] || 0,
                image: topDish.image_url || "🍔"
            },
            topItems: topItemsList.length ? topItemsList : [{ name: "No data", orders: 0, price: "$0", status: "N/A" }]
        };

        // 3. OPERATIONAL DATA
        const trafficMap = {};
        safeOrders.forEach(o => {
            const hour = new Date(o.created_at).getHours();
            const formatted = hour > 12 ? `${hour - 12} PM` : (hour === 0 ? `12 AM` : (hour === 12 ? `12 PM` : `${hour} AM`));
            trafficMap[formatted] = (trafficMap[formatted] || 0) + 1;
        });
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
            status: "Optimal"
        }));

        const recentOrders = [...safeOrders]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3)
            .map(o => ({
                id: o.id,
                type: "Order",
                title: `New Order $${o.total_amount}`,
                time: "Recently",
                status: o.status || "Pending"
            }));

        const recentShifts = safeShifts.map(s => ({
            id: s.id,
            type: "Staff",
            title: `Staff clock-in`,
            time: "Recently",
            status: "System"
        }));

        const activity = [...recentOrders, ...recentShifts].slice(0, 5);

        const operationalData = {
            traffic: traffic.length ? traffic : [{ time: "N/A", count: 0 }],
            departments: departments.length ? departments : [{ name: "N/A", share: 0, growth: "0%", status: "N/A" }],
            activity: activity.length ? activity : [{ id: 1, type: "System", title: "No recent activity", time: "Now", status: "Idle" }]
        };

        res.json({
            branchesFromDb: branches,
            managers: managers,
            incomeData,
            menuData,
            operationalData
        });

    } catch (err) {
        console.error(err);
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
