import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"

export function SalesForecast({ selectedBranch = "all" }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/predict/sales-forecast', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        branchId: selectedBranch,
                        daysToPredict: 7
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch predictions');
                }
                
                const result = await response.json();
                
                // Transform for chart
                const chartData = result.forecast.map((val, idx) => ({
                    month: `Day ${idx + 1}`,
                    predicted: Math.round(val)
                }));
                
                setData(chartData);
                setError(null);
            } catch (err) {
                console.error('Prediction error:', err);
                setError(err.message);
                // Fallback to mock data
                setData([
                    { month: "Day 1", predicted: 4200 },
                    { month: "Day 2", predicted: 4400 },
                    { month: "Day 3", predicted: 4100 },
                    { month: "Day 4", predicted: 4600 },
                    { month: "Day 5", predicted: 4900 },
                    { month: "Day 6", predicted: 5200 },
                    { month: "Day 7", predicted: 4800 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPredictions();
    }, [selectedBranch]);

    const branchText = selectedBranch === "all"
        ? "All Branches"
        : `Branch ${selectedBranch}`;

    if (loading) {
        return (
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Sales Forecast</CardTitle>
                    <CardDescription>Loading predictions...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Sales Forecast</CardTitle>
                <CardDescription>
                    Revenue performance for: <span className="font-semibold text-teal-600">{branchText}</span>
                    {error && <span className="text-red-500 ml-2">(Using fallback data)</span>}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{
                    predicted: {
                        label: "Predicted Sales",
                        color: "#00ADB5",
                    },
                }} className="min-h-80 w-full">
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="var(--color-predicted)"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: "var(--color-predicted)" }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}