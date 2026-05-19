import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.get('/notifications', async (req, res) => {
    try {
        const notifications = [];
        let notifId = 1;
        
        const companyId = req.headers['x-company-id'];
        let branchIds = [];
        
        if (companyId) {
            const { data: companyBranches } = await supabase
                .from('branches')
                .select('id')
                .eq('company_id', companyId);
            branchIds = (companyBranches || []).map(b => b.id);
        }

        // 1. Critical Low Stock Alerts (Urgent)
        // Check for products where stock < 50
        let stockQuery = supabase
            .from('branch_stock')
            .select(`
                stock_quantity, 
                branches(name), 
                products!inner(name, is_active)
            `)
            .eq('products.is_active', true)
            .lt('stock_quantity', 50)
            .order('stock_quantity', { ascending: true })
            .limit(10);
            
        if (companyId) {
            stockQuery = stockQuery.in('branch_id', branchIds);
        } else {
            stockQuery = stockQuery.eq('branch_id', '00000000-0000-0000-0000-000000000000');
        }

        const { data: stockData, error: stockError } = await stockQuery;
            
        if (!stockError && stockData) {
            stockData.forEach(item => {
                const branchName = item.branches?.name || 'a branch';
                const productName = item.products?.name || 'A product';
                
                const stableTime = new Date();
                stableTime.setMinutes(12, 0, 0); 

                notifications.push({
                    id: notifId++,
                    title: "Critical Low Stock",
                    description: `${productName} is critically low (${item.stock_quantity} units) at ${branchName}.`,
                    timestamp: stableTime.toISOString(),
                    type: "urgent"
                });
            });
        }

        // 2. Performance Warning (Warning)
        let ordersQuery = supabase
            .from('orders')
            .select('total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(20);

        if (companyId) {
            ordersQuery = ordersQuery.eq('company_id', companyId);
        } else {
            ordersQuery = ordersQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
        }
            
        const { data: recentOrders, error: orderError } = await ordersQuery;
            
        if (!orderError && recentOrders && recentOrders.length > 0) {
            const avgOrder = recentOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0) / recentOrders.length;
            if (avgOrder < 40) { 
                 notifications.push({
                    id: notifId++,
                    title: "Performance Warning",
                    description: `Average order value across recent transactions has dropped significantly (Avg: $${Math.round(avgOrder)}).`,
                    timestamp: recentOrders[0].created_at, 
                    type: "warning"
                });
            }
        }

        res.json(notifications.slice(0, 10));
    } catch (err) {
        console.error("Error generating notifications:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
