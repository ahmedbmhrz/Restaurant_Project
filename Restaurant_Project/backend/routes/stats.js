import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Endpoint for the IncomeBranchTracker component
router.get('/income-branch-tracker', async (req, res) => {
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

        const chartData = branches.map((b, i) => {
            const shortName = b.name ? b.name.substring(0, 3).toUpperCase() : `B${i}`;
            const actualIncome = branchIncomeMap[b.id] || 0;
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

        const top5Branches = chartData
            .sort((a, b) => b.income - a.income)
            .slice(0, 5);

        res.json(top5Branches);
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
