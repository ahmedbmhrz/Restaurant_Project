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
                
                const chartData = [];
                
                // 1. Add historical actuals
                if (result.historical_dates) {
                    result.historical_dates.forEach((date, i) => {
                        chartData.push({
                            date: date,
                            actual: Math.round(result.historical[i]),
                            // The last historical day also acts as the start of the predicted line
                            predicted: i === result.historical_dates.length - 1 ? Math.round(result.historical[i]) : null
                        });
                    });
                }
                
                // 2. Add future predictions
                if (result.forecast_dates) {
                    result.forecast_dates.forEach((date, i) => {
                        chartData.push({
                            date: date,
                            actual: null,
                            predicted: Math.round(result.forecast[i])
                        });
                    });
                }
                
                setData(chartData);
                setError(null);
            } catch (err) {
                console.error('Prediction error:', err);
                setError(err.message);
                // Fallback to mock data with historical context
                setData([
                    { date: "04-25", actual: 3800, predicted: null },
                    { date: "04-26", actual: 4200, predicted: null },
                    { date: "04-27", actual: 4400, predicted: 4400 },
                    { date: "04-28", actual: null, predicted: 4600 },
                    { date: "04-29", actual: null, predicted: 4900 },
                    { date: "04-30", actual: null, predicted: 5200 },
                    { date: "05-01", actual: null, predicted: 4800 },
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
                    actual: {
                        label: "Actual Sales",
                        color: "#00ADB5", // Teal for actuals (solid)
                    },
                    predicted: {
                        label: "Predicted Sales",
                        color: "#00ADB5", // Teal for predictions (dotted)
                    },
                }} className="min-h-80 w-full">
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
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
                            dataKey="actual"
                            stroke="var(--color-actual)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "var(--color-actual)" }}
                            activeDot={{ r: 6 }}
                            connectNulls
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="var(--color-predicted)"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: "var(--color-predicted)" }}
                            connectNulls
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}