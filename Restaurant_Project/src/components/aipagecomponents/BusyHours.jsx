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

export function BusyHours({ selectedBranch = "all" }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('hour');

    useEffect(() => {
        const fetchBusyHours = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/predict/busy-hours', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        branchId: selectedBranch,
                        timeframe: timeframe
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch busy hours');
                }
                
                const result = await response.json();
                
                // Transform to chart format
                const chartData = [];
                if (timeframe === 'dayOfWeek') {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const currentDayIndex = new Date().getDay();
                    for (let i = 0; i <= 6; i++) {
                        chartData.push({
                            label: i === currentDayIndex ? `${days[i]} (Today)` : days[i],
                            actual: result.historical_avg?.[i] || 0,
                            predicted: result.hourly_forecast?.[i] ? Math.round(result.hourly_forecast[i]) : 0
                        });
                    }
                } else {
                    for (let hour = 8; hour <= 23; hour++) {
                        chartData.push({
                            label: `${hour}:00`,
                            actual: result.historical_avg?.[hour] || 0,
                            predicted: result.hourly_forecast?.[hour] ? Math.round(result.hourly_forecast[hour]) : 0
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
                    { hour: "8:00", actual: 18, predicted: 20 },
                    { hour: "10:00", actual: 32, predicted: 35 },
                    { hour: "12:00", actual: 80, predicted: 85 },
                    { hour: "14:00", actual: 55, predicted: 60 },
                    { hour: "16:00", actual: 38, predicted: 40 },
                    { hour: "18:00", actual: 90, predicted: 95 },
                    { hour: "20:00", actual: 105, predicted: 110 },
                    { hour: "22:00", actual: 40, predicted: 45 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBusyHours();
    }, [selectedBranch, timeframe]);

    const branchText = selectedBranch === "all"
        ? "Aggregate View"
        : `Branch ${selectedBranch}`;

    if (loading) {
        return (
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Predicted Busy Hours</CardTitle>
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

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>Predicted Busy {timeframe === 'hour' ? 'Hours' : 'Days'}</CardTitle>
                    <CardDescription>
                        Density prediction for: <span className="font-semibold text-teal-600">{branchText}</span>
                        {error && <span className="text-red-500 ml-2">(Using fallback data)</span>}
                    </CardDescription>
                </div>
                <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="border border-slate-200 rounded px-3 py-1 bg-white text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="hour">By Hour</option>
                    <option value="dayOfWeek">By Day of Week</option>
                </select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{
                    actual: {
                        label: "Actual Average",
                        color: "#0f172a", // Dark slate
                    },
                    predicted: {
                        label: "Predicted Traffic",
                        color: "#00ADB5", // Teal
                    },
                }} className="min-h-64 w-full">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="actual"
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-actual)"
                            barSize={16}
                        />
                        <Bar
                            dataKey="predicted"
                            radius={[4, 4, 0, 0]}
                            fill="var(--color-predicted)"
                            barSize={16}
                        />
                    </BarChart>
                </ChartContainer>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-3 w-3 rounded-full bg-[#00ADB5]" />
                    <span>Peak expectation period (12pm - 2pm, 6pm - 9pm)</span>
                </div>
            </CardContent>
        </Card>
    )
}