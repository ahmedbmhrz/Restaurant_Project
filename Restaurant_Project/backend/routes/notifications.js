import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.get('/notifications', async (req, res) => {
    try {
        const notifications = [];
        let notifId = 1;

        // 0. (Removed mock directive)
        
        // 1. Critical Low Stock Alerts (Urgent)
        // Check for products where stock < 50
        const { data: stockData, error: stockError } = await supabase
            .from('branch_stock')
            .select(`
                stock_quantity, 
                branches(name), 
                products(name)
            `)
            .lt('stock_quantity', 50)
            .order('stock_quantity', { ascending: true })
            .limit(10);
            
        if (!stockError && stockData) {
            stockData.forEach(item => {
                const branchName = item.branches?.name || 'a branch';
                const productName = item.products?.name || 'A product';
                
                // Stable time for notification
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
        const { data: recentOrders, error: orderError } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(20);
            
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

        // 3. (Removed mock staffing)
        // 4. (Removed mock AI forecast)
        // 5. (Removed mock health)

        res.json(notifications.slice(0, 10));
    } catch (err) {
        console.error("Error generating notifications:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
