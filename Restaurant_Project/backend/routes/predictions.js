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
        
        // 1.5. Pre-populate groupedSales with appropriate range to ensure no gaps
        const groupedSales = {};
        const now = new Date();

        if (timeframe === 'year') {
            const currentYear = now.getFullYear();
            for (let i = 4; i >= 0; i--) {
                groupedSales[(currentYear - i).toString()] = 0;
            }
        } else if (timeframe === 'month') {
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                groupedSales[dateKey] = 0;
            }
        } else if (timeframe === 'week') {
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - (i * 7));
                const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
                const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
                const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                const dateKey = `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                groupedSales[dateKey] = 0;
            }
        } else {
            // Default: Daily (last 30 days)
            for (let i = 30; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                groupedSales[dateKey] = 0;
            }
        }

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
                
                // Only add to groupedSales if it's within our tracked range (or create it if missing)
                if (groupedSales[dateKey] === undefined) {
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
        const { branchId, timeframe = 'hour', dayOfWeek = null } = req.body;
        
        // 1. Fetch order data from Supabase
        let query = supabase.from('orders').select('created_at');
        if (branchId !== 'all') {
            query = query.eq('branch_id', branchId);
        }
        
        const { data: orderData, error } = await query
            .order('created_at', { ascending: false })
            .limit(2500); // Increased limit to ensure we have enough data for specific day profiles
        
        if (error) throw error;
        
        // Filter by day of week if specified (0-6)
        let filteredData = orderData || [];
        if (dayOfWeek !== null && dayOfWeek !== undefined) {
            filteredData = filteredData.filter(record => {
                const dateObj = new Date(record.created_at);
                return dateObj.getDay() === parseInt(dayOfWeek);
            });
        }
        
        // 2. Pre-populate trafficByPeriod to ensure all hours/days are accounted for
        const trafficByPeriod = {};
        if (timeframe === 'dayOfWeek') {
            for (let i = 0; i <= 6; i++) trafficByPeriod[i] = [];
        } else {
            for (let i = 0; i <= 23; i++) trafficByPeriod[i] = [];
        }

        const dailyCounts = {}; // Used to track traffic per individual day to calculate averages
        
        if (filteredData) {
            filteredData.forEach(record => {
                const dateObj = new Date(record.created_at);
                const dateStr = dateObj.toISOString().split('T')[0];
                
                let periodKey;
                if (timeframe === 'dayOfWeek') {
                    periodKey = dateObj.getDay(); 
                } else {
                    periodKey = dateObj.getHours(); 
                }
                
                if (!dailyCounts[dateStr]) dailyCounts[dateStr] = {};
                if (!dailyCounts[dateStr][periodKey]) dailyCounts[dateStr][periodKey] = 0;
                dailyCounts[dateStr][periodKey]++;
            });
            
            // Convert to the format Python expects: { period: [count1, count2, ...] }
            Object.values(dailyCounts).forEach(dayRecord => {
                Object.entries(dayRecord).forEach(([period, count]) => {
                    if (trafficByPeriod[period] !== undefined) {
                        trafficByPeriod[period].push(count);
                    }
                });
            });
        }
        
        // 3. If timeframe is dayOfWeek, generate a specific 7-day timeline
        if (timeframe === 'dayOfWeek') {
            const timeline = [];
            const now = new Date();
            
            // Calculate recent trend factor (last 7 days vs historical average)
            let recentTotal = 0;
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const dateKey = d.toISOString().split('T')[0];
                const dayActual = dailyCounts[dateKey] ? Object.values(dailyCounts[dateKey]).reduce((a, b) => a + b, 0) : 0;
                recentTotal += dayActual;
            }
            const recentAvg = recentTotal / 7;
            
            // Get last 3 days + today + next 3 days
            for (let i = -3; i <= 3; i++) {
                const d = new Date();
                d.setDate(now.getDate() + i);
                const dateKey = d.toISOString().split('T')[0];
                const dateLabel = dateKey.slice(5); // MM-DD
                const dayIdx = d.getDay();
                
                // Actual traffic for this specific day
                const actual = dailyCounts[dateKey] ? Object.values(dailyCounts[dateKey]).reduce((a, b) => a + b, 0) : 0;
                
                // Historical average for this day of week
                const historicalDays = trafficByPeriod[dayIdx] || [];
                const histAvg = historicalDays.length > 0 ? historicalDays.reduce((a, b) => a + b, 0) / historicalDays.length : 0;
                
                // Smart Prediction: Blend historical average with recent trend
                // If recentAvg is 0, trendFactor will be 0, pulling prediction down
                const trendFactor = histAvg > 0 ? (recentAvg / histAvg) : 1;
                // Cap the trend factor to prevent wild swings, but allow it to go to 0
                const cappedTrend = Math.min(Math.max(trendFactor, 0), 1.5);
                
                let predicted = 0;
                if (i >= 0) {
                    predicted = Math.round(histAvg * cappedTrend * 1.05);
                }
                
                timeline.push({
                    date: dateLabel,
                    fullDate: dateKey,
                    actual: i <= 0 ? actual : 0,
                    predicted: i >= 0 ? (i === 0 && actual > 0 ? Math.max(actual, predicted) : predicted) : 0
                });
            }
            
            return res.json({
                status: "success",
                branch: branchId,
                timeline: timeline
            });
        }

        // 4. Calculate recent trend factor for Hourly view as well
        let recentTotal = 0;
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const dayActual = dailyCounts[dateKey] ? Object.values(dailyCounts[dateKey]).reduce((a, b) => a + b, 0) : 0;
            recentTotal += dayActual;
        }
        const recentAvg = recentTotal / 7;
        
        // Calculate global average per day to get a baseline trend
        const totalHistoricalDays = Object.keys(dailyCounts).length || 1;
        const globalDailyAvg = Object.values(trafficByPeriod).flat().reduce((a, b) => a + b, 0) / totalHistoricalDays;
        
        const trendFactor = globalDailyAvg > 0 ? (recentAvg / globalDailyAvg) : (recentAvg > 0 ? 1 : 0);
        const cappedTrend = Math.min(Math.max(trendFactor, 0), 1.5);

        // 5. Call Python ML service
        const pythonRes = await fetch(`${PYTHON_URL}/api/predict/busy-hours`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                traffic_by_hour: trafficByPeriod 
            })
        });
        
        if (!pythonRes.ok) {
            throw new Error(`Python service error: ${pythonRes.status}`);
        }
        
        const busyHours = await pythonRes.json();
        
        // 6. Calculate hourly actuals for TODAY specifically
        const hourlyActuals = {};
        const todayStr = new Date().toISOString().split('T')[0];
        
        filteredData.forEach(record => {
            const dateObj = new Date(record.created_at);
            const dateStr = dateObj.toISOString().split('T')[0];
            if (dateStr === todayStr) {
                const hour = dateObj.getHours();
                hourlyActuals[hour] = (hourlyActuals[hour] || 0) + 1;
            }
        });
        
        // Apply trend factor to python results
        if (busyHours.hourly_forecast) {
            Object.keys(busyHours.hourly_forecast).forEach(h => {
                busyHours.hourly_forecast[h] = Math.round(busyHours.hourly_forecast[h] * cappedTrend);
            });
        }
        if (busyHours.peak_hours) {
            busyHours.peak_hours.forEach(peak => {
                peak.expected_traffic = Math.round(peak.expected_traffic * cappedTrend);
            });
        }
        
        // 7. Return response
        res.json({
            status: "success",
            branch: branchId,
            hourly_actuals: hourlyActuals,
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