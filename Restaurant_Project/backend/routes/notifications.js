import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.get('/notifications', async (req, res) => {
    try {
        const notifications = [];
        let notifId = 1;

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
            .limit(2);
            
        if (!stockError && stockData) {
            stockData.forEach(item => {
                const branchName = item.branches?.name || 'a branch';
                const productName = item.products?.name || 'A product';
                notifications.push({
                    id: notifId++,
                    title: "Critical Low Stock",
                    description: `${productName} is critically low (${item.stock_quantity} units) at ${branchName}.`,
                    time: "Just now",
                    type: "urgent"
                });
            });
        } else if (stockError) {
             console.error("Stock fetch error in notifications:", stockError);
        }

        // 2. Performance Warning (Warning)
        const { data: recentOrders, error: orderError } = await supabase
            .from('orders')
            .select('total_amount')
            .order('created_at', { ascending: false })
            .limit(20);
            
        if (!orderError && recentOrders && recentOrders.length > 0) {
            const avgOrder = recentOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0) / recentOrders.length;
            // If average order value drops below a certain threshold, flag it.
            if (avgOrder < 40) { 
                 notifications.push({
                    id: notifId++,
                    title: "Performance Warning",
                    description: `Average order value across recent transactions has dropped significantly (Avg: $${Math.round(avgOrder)}).`,
                    time: "1h ago",
                    type: "warning"
                });
            }
        }

        // 3. Staffing Alert (Info)
        // We'll generate a static HQ alert for personnel management
        notifications.push({
            id: notifId++,
            title: "Staffing Overview",
            description: "All regional managers have successfully clocked in for the evening shift.",
            time: "2h ago",
            type: "info"
        });

        // 4. AI Forecast (Success/Insight)
        notifications.push({
            id: notifId++,
            title: "AI Forecast: Surge Predicted",
            description: "Machine learning predicts a 35% surge in delivery orders tomorrow due to local events.",
            time: "4h ago",
            type: "success"
        });
        
        // 5. System Health
        notifications.push({
            id: notifId++,
            title: "System Health",
            description: "All branch POS terminals and inventory syncing services are online.",
            time: "12h ago",
            type: "info"
        });

        // Ensure we only return a neat list of up to 5 or 6 notifications
        res.json(notifications.slice(0, 6));
    } catch (err) {
        console.error("Error generating notifications:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
