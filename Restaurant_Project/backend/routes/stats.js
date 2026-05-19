import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Endpoint for the IncomeBranchTracker component
router.get('/income-branch-tracker', async (req, res) => {
    try {
        const companyId = req.headers['x-company-id'];
        
        let bQuery = supabase.from('branches').select('*');
        if (companyId) {
            bQuery = bQuery.eq('company_id', companyId);
        } else {
            bQuery = bQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }
        
        const { data: branches, error: branchError } = await bQuery;
        if (branchError) throw branchError;

        // Calculate date ranges
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

        // Fetch orders from the start of last month to now, scoped by companyId
        let oQuery = supabase
            .from('orders')
            .select('branch_id, total_amount, created_at')
            .gte('created_at', startOfLastMonth);
            
        if (companyId) {
            oQuery = oQuery.eq('company_id', companyId);
        } else {
            oQuery = oQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
        }

        const { data: orders, error: ordersError } = await oQuery;
        if (ordersError) throw ordersError;

        // Group income by branch and month
        const branchStats = {};
        branches.forEach(b => {
            branchStats[b.id] = { thisMonth: 0, lastMonth: 0 };
        });

        (orders || []).forEach(order => {
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

// Endpoint for the global income target progress
router.get('/income-target', async (req, res) => {
    try {
        const companyId = req.headers['x-company-id'];
        
        // 1. Fetch tenant-specific target from the companies table
        let targetIncome = 0; // Default fallback for brand new tenants
        if (companyId) {
            const { data: company, error: compErr } = await supabase
                .from('companies')
                .select('income_target')
                .eq('id', companyId)
                .maybeSingle();
                
            if (!compErr && company && company.income_target !== null) {
                targetIncome = Number(company.income_target);
            }
        }

        // 2. Fetch total sales scoped by companyId
        let oQuery = supabase.from('orders').select('total_amount');
        if (companyId) {
            oQuery = oQuery.eq('company_id', companyId);
        } else {
            oQuery = oQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
        }
        
        const { data: orders, error } = await oQuery;
        if (error) throw error;

        let currentIncome = 0;
        if (orders && orders.length > 0) {
            currentIncome = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }

        let progressPercentage = 0;
        if (targetIncome > 0) {
            progressPercentage = Math.round((currentIncome / targetIncome) * 100);
        }
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

// Endpoint to update the global income target
router.post('/income-target', async (req, res) => {
    try {
        const { target } = req.body;
        const companyId = req.headers['x-company-id'];
        
        if (!companyId) {
            return res.status(400).json({ error: "Missing company context" });
        }
        
        if (target && !isNaN(target)) {
            const { error: updateErr } = await supabase
                .from('companies')
                .update({ income_target: Number(target) })
                .eq('id', companyId);
                
            if (updateErr) throw updateErr;
        }
        
        res.json({ success: true, target: Number(target) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
