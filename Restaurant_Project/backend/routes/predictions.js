import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();
const PYTHON_URL = process.env.PYTHON_ML_URL || 'http://127.0.0.1:5001';
const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:5000';

// ===== SALES FORECAST =====
router.post('/sales-forecast', async (req, res) => {
    try {
        const { branchId, daysToPredict = 7 } = req.body;
        
        // 1. Fetch sales data from Supabase
        let query = supabase.from('orders').select('total_amount, created_at');
        if (branchId !== 'all') {
            query = query.eq('branch_id', branchId);
        }
        
        const { data: salesData, error } = await query
            .order('created_at', { ascending: false })
            .limit(1500); // Fetch enough recent orders to get daily totals
        
        if (error) throw error;
        
        // Group sales by day
        const dailySales = {};
        if (salesData) {
            salesData.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                
                if (!dailySales[dateStr]) {
                    dailySales[dateStr] = 0;
                }
                dailySales[dateStr] += (order.total_amount || 0);
            });
        }
        
        // Sort dates chronologically (oldest to newest)
        const sortedDates = Object.keys(dailySales).sort();
        
        // Extract the daily totals as an array for the AI model
        const salesValues = sortedDates.map(date => dailySales[date]);
        
        // 2. Call Python ML service
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_values: salesValues,
                days_to_predict: daysToPredict
            })
        });
        
        if (!pythonRes.ok) {
            throw new Error(`Python service error: ${pythonRes.status}`);
        }
        
        const forecast = await pythonRes.json();
        
        // 3. Return formatted response
        res.json({
            status: "success",
            branch: branchId,
            forecast: forecast.forecast,
            days_predicted: forecast.days_predicted
        });
    } catch (err) {
        console.error('Sales forecast error:', err);
        res.status(500).json({ 
            error: err.message,
            status: "error"
        });
    }
});

// ===== BUSY HOURS PREDICTION =====
router.post('/busy-hours', async (req, res) => {
    try {
        const { branchId } = req.body;
        
        // 1. Fetch order data from Supabase
        let query = supabase.from('orders').select('created_at');
        if (branchId !== 'all') {
            query = query.eq('branch_id', branchId);
        }
        
        const { data: orderData, error } = await query
            .order('created_at', { ascending: false })
            .limit(500); // Recent order data
        
        if (error) throw error;
        
        // 2. Group by hour based on order creation time
        const trafficByHour = {};
        const dailyCounts = {};
        
        if (orderData) {
            orderData.forEach(record => {
                const dateObj = new Date(record.created_at);
                const dateStr = dateObj.toISOString().split('T')[0];
                const hour = dateObj.getHours();
                
                if (!dailyCounts[dateStr]) dailyCounts[dateStr] = {};
                if (!dailyCounts[dateStr][hour]) dailyCounts[dateStr][hour] = 0;
                dailyCounts[dateStr][hour]++;
            });
            
            // Convert to the format Python expects: { hour: [count1, count2, ...] }
            Object.values(dailyCounts).forEach(dayRecord => {
                Object.entries(dayRecord).forEach(([hour, count]) => {
                    if (!trafficByHour[hour]) trafficByHour[hour] = [];
                    trafficByHour[hour].push(count);
                });
            });
        }
        
        // 3. Call Python ML service
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/busy-hours`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                traffic_by_hour: trafficByHour
            })
        });
        
        if (!pythonRes.ok) {
            throw new Error(`Python service error: ${pythonRes.status}`);
        }
        
        const busyHours = await pythonRes.json();
        
        // 4. Return response
        res.json({
            status: "success",
            branch: branchId,
            ...busyHours
        });
    } catch (err) {
        console.error('Busy hours error:', err);
        res.status(500).json({ 
            error: err.message,
            status: "error"
        });
    }
});

// ===== GLOBAL INSIGHTS =====
router.post('/insights', async (req, res) => {
    try {
        const { branchId } = req.body;
        
        // Get forecast and busy hours data (call the functions directly)
        const forecastRes = await fetch(`${SERVER_URL}/api/predict/sales-forecast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ branchId, daysToPredict: 7 })
        });
        
        const busyHoursRes = await fetch(`${SERVER_URL}/api/predict/busy-hours`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ branchId })
        });
        
        const forecast = await forecastRes.json();
        const busyHours = await busyHoursRes.json();
        
        // Call Python for insights
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/insights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_forecast: forecast.forecast || [],
                peak_hours: busyHours.peak_hours || []
            })
        });
        
        if (!pythonRes.ok) {
            throw new Error(`Python service error: ${pythonRes.status}`);
        }
        
        const insights = await pythonRes.json();
        
        res.json(insights);
    } catch (err) {
        console.error('Insights error:', err);
        res.status(500).json({ 
            error: err.message,
            status: "error"
        });
    }
});

export default router;