import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Endpoint for the IncomeBranchTracker component
router.get('/income-branch-tracker', async (req, res) => {
    try {
        const { data: branches, error: branchError } = await supabase.from('branches').select('*');
        if (branchError) throw branchError;

        // Calculate date ranges
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

        // Fetch orders from the start of last month to now
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('branch_id, total_amount, created_at')
            .gte('created_at', startOfLastMonth);
            
        if (ordersError) throw ordersError;

        // Group income by branch and month
        const branchStats = {};
        branches.forEach(b => {
            branchStats[b.id] = { thisMonth: 0, lastMonth: 0 };
        });

        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const isThisMonth = orderDate >= new Date(startOfThisMonth);
            const branchId = order.branch_id;

            if (branchStats[branchId]) {
                if (isThisMonth) {
                    branchStats[branchId].thisMonth += (order.total_amount || 0);
                } else {
                    branchStats[branchId].lastMonth += (order.total_amount || 0);
                }
            }
        });

        const chartData = branches.map((b) => {
            const shortName = b.name ? b.name.substring(0, 3).toUpperCase() : "BRH";
            const current = branchStats[b.id].thisMonth;
            const previous = branchStats[b.id].lastMonth;
            
            // Calculate real percentage increase
            let increase = "0%";
            if (previous > 0) {
                const pct = ((current - previous) / previous) * 100;
                increase = `${pct >= 0 ? '+' : ''}${Math.round(pct)}%`;
            } else if (current > 0) {
                increase = "+100%"; // First sales this month
            }

            return {
                id: b.id,
                branchName: shortName,
                fullName: b.name,
                income: Math.round(current),
                increase: increase
            };
        });

        // Return all branches, sorted by income
        const sortedData = chartData.sort((a, b) => b.income - a.income);

        res.json(sortedData);
    } catch (err) {
        console.error("Error in income-branch-tracker:", err);
        res.status(500).json({ error: err.message });
    }
});

let globalTargetIncome = 17500; // In-memory fallback for demo

// Endpoint for the global income target progress
router.get('/income-target', async (req, res) => {
    try {
        const { data: orders, error } = await supabase.from('orders').select('total_amount');
        if (error) throw error;

        let currentIncome = 0;
        if (orders && orders.length > 0) {
            currentIncome = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }

        let progressPercentage = Math.round((currentIncome / globalTargetIncome) * 100);
        if (progressPercentage > 100) progressPercentage = 100;
        
        res.json({
            current: currentIncome,
            target: globalTargetIncome,
            percentage: progressPercentage
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to update the global income target
router.post('/income-target', async (req, res) => {
    try {
        const { target } = req.body;
        if (target && !isNaN(target)) {
            globalTargetIncome = Number(target);
        }
        res.json({ success: true, target: globalTargetIncome });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
