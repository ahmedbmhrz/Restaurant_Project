import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();
const PYTHON_URL = process.env.PYTHON_ML_URL || 'http://127.0.0.1:5001';
const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:5000';

// ===== SALES FORECAST =====
router.post('/sales-forecast', async (req, res) => {
    try {
        const { branchId, timeframe = 'day' } = req.body;
        
        // Set how many steps to predict based on timeframe
        let stepsToPredict = 7;
        if (timeframe === 'week') stepsToPredict = 4;
        else if (timeframe === 'month') stepsToPredict = 6;
        else if (timeframe === 'year') stepsToPredict = 3;
        
        // 1. Fetch sales data from Supabase
        let query = supabase.from('orders').select('total_amount, created_at');
        if (branchId !== 'all') {
            query = query.eq('branch_id', branchId);
        }
        
        const { data: salesData, error } = await query
            .order('created_at', { ascending: false })
            .limit(10000); // Fetch many recent orders to get robust grouping
        
        if (error) throw error;
        
        // Group sales by timeframe
        const groupedSales = {};
        if (salesData) {
            salesData.forEach(order => {
                const dateObj = new Date(order.created_at);
                let dateKey;
                
                if (timeframe === 'year') {
                    dateKey = dateObj.getFullYear().toString();
                } else if (timeframe === 'month') {
                    dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                } else if (timeframe === 'week') {
                    const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
                    const pastDaysOfYear = (dateObj - firstDayOfYear) / 86400000;
                    const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                    dateKey = `${dateObj.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                } else {
                    dateKey = dateObj.toISOString().split('T')[0];
                }
                
                if (!groupedSales[dateKey]) {
                    groupedSales[dateKey] = 0;
                }
                groupedSales[dateKey] += (order.total_amount || 0);
            });
        }
        
        // Sort keys chronologically
        const sortedKeys = Object.keys(groupedSales).sort();
        const salesValues = sortedKeys.map(key => groupedSales[key]);
        
        // 2. Call Python ML service
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_values: salesValues,
                days_to_predict: stepsToPredict // The python script treats this as 'steps'
            })
        });
        
        if (!pythonRes.ok) {
            throw new Error(`Python service error: ${pythonRes.status}`);
        }
        
        const forecast = await pythonRes.json();
        
        // 3. Prepare display data
        const recentCount = timeframe === 'year' ? 3 : 7;
        const recentKeys = sortedKeys.slice(-recentCount);
        const recentActuals = salesValues.slice(-recentCount);
        
        const lastDateStr = recentKeys[recentKeys.length - 1] || new Date().toISOString().split('T')[0];
        const futureDates = [];
        
        // Generate future keys
        if (timeframe === 'year') {
            const lastYear = parseInt(lastDateStr) || new Date().getFullYear();
            for (let i = 1; i <= forecast.days_predicted; i++) {
                futureDates.push((lastYear + i).toString());
            }
        } else if (timeframe === 'month') {
            let [y, m] = lastDateStr.split('-').map(Number);
            for (let i = 1; i <= forecast.days_predicted; i++) {
                m++;
                if (m > 12) { m = 1; y++; }
                futureDates.push(`${y}-${String(m).padStart(2, '0')}`);
            }
        } else if (timeframe === 'week') {
            let [y, w] = lastDateStr.split('-W');
            w = parseInt(w) || 1;
            y = parseInt(y) || new Date().getFullYear();
            for (let i = 1; i <= forecast.days_predicted; i++) {
                w++;
                if (w > 52) { w = 1; y++; }
                futureDates.push(`${y}-W${String(w).padStart(2, '0')}`);
            }
        } else {
            const lastDateObj = new Date(lastDateStr);
            for (let i = 1; i <= forecast.days_predicted; i++) {
                const nextDate = new Date(lastDateObj);
                nextDate.setDate(lastDateObj.getDate() + i);
                futureDates.push(nextDate.toISOString().split('T')[0].slice(5)); // MM-DD
            }
        }
        
        let historicalDatesFormatted = recentKeys;
        if (timeframe === 'day') {
            historicalDatesFormatted = recentKeys.map(d => d.slice(5)); // MM-DD
        }
        
        // 4. Return formatted response
        res.json({
            status: "success",
            branch: branchId,
            historical: recentActuals,
            historical_dates: historicalDatesFormatted,
            forecast: forecast.forecast,
            forecast_dates: futureDates,
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
        const { branchId, timeframe = 'hour' } = req.body;
        
        // 1. Fetch order data from Supabase
        let query = supabase.from('orders').select('created_at');
        if (branchId !== 'all') {
            query = query.eq('branch_id', branchId);
        }
        
        const { data: orderData, error } = await query
            .order('created_at', { ascending: false })
            .limit(1500); // Increased limit to ensure we have enough data for a full week profile
        
        if (error) throw error;
        
        // 2. Group by hour or day of week based on order creation time
        const trafficByPeriod = {};
        const dailyCounts = {}; // Used to track traffic per individual day to calculate averages
        
        if (orderData) {
            orderData.forEach(record => {
                const dateObj = new Date(record.created_at);
                const dateStr = dateObj.toISOString().split('T')[0];
                
                let periodKey;
                if (timeframe === 'dayOfWeek') {
                    // Group by Day of Week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                    periodKey = dateObj.getDay(); 
                } else {
                    // Group by Hour of Day (0 - 23)
                    periodKey = dateObj.getHours(); 
                }
                
                if (!dailyCounts[dateStr]) dailyCounts[dateStr] = {};
                if (!dailyCounts[dateStr][periodKey]) dailyCounts[dateStr][periodKey] = 0;
                dailyCounts[dateStr][periodKey]++;
            });
            
            // Convert to the format Python expects: { period: [count1, count2, ...] }
            Object.values(dailyCounts).forEach(dayRecord => {
                Object.entries(dayRecord).forEach(([period, count]) => {
                    if (!trafficByPeriod[period]) trafficByPeriod[period] = [];
                    trafficByPeriod[period].push(count);
                });
            });
        }
        
        // 3. Call Python ML service
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/busy-hours`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                traffic_by_hour: trafficByPeriod // Python script handles the keys generically
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
                historical_sales: forecast.historical || [],
                sales_forecast: forecast.forecast || [],
                historical_traffic: busyHours.historical_avg || {},
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