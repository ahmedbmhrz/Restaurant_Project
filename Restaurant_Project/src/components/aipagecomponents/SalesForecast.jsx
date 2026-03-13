
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
    { month: "Jan", actual: 4000, predicted: 4200 },
    { month: "Feb", actual: 3000, predicted: 3100 },
    { month: "Mar", actual: 5000, predicted: 4800 },
    { month: "Apr", actual: 4500, predicted: 4600 },
    { month: "May", actual: 6000, predicted: 5900 },
    { month: "Jun", actual: 5500, predicted: 6200 },
    { month: "Jul", predicted: 6800 },
    { month: "Aug", predicted: 7200 },
]

const chartConfig = {
    actual: {
        label: "Actual Sales",
        color: "hsl(var(--primary))",
    },
    predicted: {
        label: "Predicted Sales",
        color: "#00ADB5",
    },
}

export function SalesForecast({ selectedBranch = "all" }) {
    const branchText = selectedBranch === "all"
        ? "All Branches"
        : `Branch ${selectedBranch}`;

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Sales Forecast</CardTitle>
                <CardDescription>
                    Revenue performance for: <span className="font-semibold text-teal-600">{branchText}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-80 w-full">
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
                            dataKey="actual"
                            stroke="var(--color-actual)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "var(--color-actual)" }}
                            activeDot={{ r: 6 }}
                        />
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
    )
}
