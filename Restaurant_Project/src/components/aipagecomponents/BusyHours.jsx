import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState, useEffect } from "react"

export function BusyHours({ selectedBranch = "all", branchName = "All Branches" }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('hour');
    const [selectedDay, setSelectedDay] = useState('all'); // 'all' or 0-6 (Sun-Sat)

    useEffect(() => {
        const fetchBusyHours = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/predict/busy-hours', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        branchId: selectedBranch,
                        timeframe: timeframe,
                        dayOfWeek: timeframe === 'hour' && selectedDay !== 'all' ? parseInt(selectedDay) : null
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch busy hours');
                }
                
                const result = await response.json();
                
                // Transform to chart format
                const chartData = [];
                if (timeframe === 'dayOfWeek') {
                    // Result now contains a timeline for dayOfWeek
                    if (result.timeline) {
                        const todayStr = new Date().toISOString().split('T')[0].slice(5);
                        result.timeline.forEach(item => {
                            chartData.push({
                                label: item.date === todayStr ? `${item.date} (Today)` : item.date,
                                actual: item.actual || 0,
                                predicted: item.predicted || 0
                            });
                        });
                    }
                } else {
                    // Hourly Timeline for Today
                    const currentHour = new Date().getHours();
                    for (let hour = 8; hour <= 23; hour++) {
                        const actual = result.hourly_actuals?.[hour] || 0;
                        const predicted = result.hourly_forecast?.[hour] || 0;
                        
                        chartData.push({
                            label: `${hour}:00`,
                            actual: hour <= currentHour ? actual : 0,
                            predicted: hour >= currentHour ? (hour === currentHour && actual > 0 ? Math.max(actual, predicted) : predicted) : 0
                        });
                    }
                }
                
                setData(chartData);
                setError(null);
            } catch (err) {
                console.error('Busy hours error:', err);
                setError(err.message);
                // Fallback to mock data
                setData([
                    { label: "10:00", actual: 15, predicted: 0 },
                    { label: "12:00", actual: 42, predicted: 0 },
                    { label: "14:00 (Now)", actual: 28, predicted: 35 },
                    { label: "16:00", actual: 0, predicted: 40 },
                    { label: "18:00", actual: 0, predicted: 95 },
                    { label: "20:00", actual: 0, predicted: 110 },
                    { label: "22:00", actual: 0, predicted: 45 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBusyHours();
    }, [selectedBranch, timeframe, selectedDay]);

    if (loading) {
        return (
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Busy Forecast</CardTitle>
                    <CardDescription>Loading predictions...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const mainTitle = timeframe === 'hour' ? "Today's Traffic Forecast" : '7-Day Traffic Forecast';

    return (
        <Card className="flex-1 border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        {mainTitle}
                    </CardTitle>
                    <CardDescription>
                        Density prediction for: <span className="font-semibold text-teal-600">{branchName}</span>
                        {error && <span className="text-red-500 ml-2">(Using fallback data)</span>}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    {timeframe === 'hour' && (
                        <select 
                            value={selectedDay} 
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="border border-slate-200 rounded px-2 py-1 bg-white text-xs text-slate-600 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="all">All Days (Avg)</option>
                            <option value="1">Mondays{new Date().getDay() === 1 ? " (Today)" : ""}</option>
                            <option value="2">Tuesdays{new Date().getDay() === 2 ? " (Today)" : ""}</option>
                            <option value="3">Wednesdays{new Date().getDay() === 3 ? " (Today)" : ""}</option>
                            <option value="4">Thursdays{new Date().getDay() === 4 ? " (Today)" : ""}</option>
                            <option value="5">Fridays{new Date().getDay() === 5 ? " (Today)" : ""}</option>
                            <option value="6">Saturdays{new Date().getDay() === 6 ? " (Today)" : ""}</option>
                            <option value="0">Sundays{new Date().getDay() === 0 ? " (Today)" : ""}</option>
                        </select>
                    )}
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="border border-slate-200 rounded px-3 py-1 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="hour">By Hour</option>
                        <option value="dayOfWeek">7-Day Timeline</option>
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{
                    actual: {
                        label: "Actual Customers",
                        color: "#0f172a", // Dark slate
                    },
                    predicted: {
                        label: "AI Expectation",
                        color: "#00ADB5", // Teal
                    },
                }} className="min-h-64 w-full">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            style={{ fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="actual"
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-actual)"
                            barSize={timeframe === 'hour' ? 14 : 24}
                        />
                        <Bar
                            dataKey="predicted"
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-predicted)"
                            barSize={timeframe === 'hour' ? 14 : 24}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-3 w-3 rounded-full bg-[#00ADB5]" />
                    <span>Live performance vs Smart AI predictions</span>
                </div>
            </CardContent>
        </Card>
    )
}