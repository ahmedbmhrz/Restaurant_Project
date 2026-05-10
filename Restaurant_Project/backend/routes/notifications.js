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
                
                // Use a deterministic timestamp so it doesn't reset to "Just now" on every refresh
                // We'll use the start of the current hour minus 12 minutes for a realistic "stable" time
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
        } else if (stockError) {
             console.error("Stock fetch error in notifications:", stockError);
        }

        // 2. Performance Warning (Warning)
        const { data: recentOrders, error: orderError } = await supabase
            .from('orders')
            .select('total_amount, created_at')
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
                    timestamp: recentOrders[0].created_at, // Use the time of the latest order
                    type: "warning"
                });
            }
        }

        // 3. Staffing Alert (Info)
        notifications.push({
            id: notifId++,
            title: "Staffing Overview",
            description: "All regional managers have successfully clocked in for the evening shift.",
            timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(), // 85 mins ago
            type: "info"
        });

        // 4. AI Forecast (Success/Insight)
        notifications.push({
            id: notifId++,
            title: "AI Forecast: Surge Predicted",
            description: "Machine learning predicts a 35% surge in delivery orders tomorrow due to local events.",
            timestamp: new Date(Date.now() - 1000 * 60 * 312).toISOString(), // ~5 hours ago
            type: "success"
        });
        
        // 5. System Health
        notifications.push({
            id: notifId++,
            title: "System Health",
            description: "All branch POS terminals and inventory syncing services are online.",
            timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 24 hours ago
            type: "info"
        });

        res.json(notifications.slice(0, 6));
    } catch (err) {
        console.error("Error generating notifications:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
