
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
    { hour: "8am", customers: 20 },
    { hour: "10am", customers: 35 },
    { hour: "12pm", customers: 85 },
    { hour: "2pm", customers: 60 },
    { hour: "4pm", customers: 40 },
    { hour: "6pm", customers: 95 },
    { hour: "8pm", customers: 110 },
    { hour: "10pm", customers: 45 },
]

const chartConfig = {
    customers: {
        label: "Expected Customers",
        color: "#00ADB5",
    },
}

export function BusyHours({ selectedBranch = "all" }) {
    const branchText = selectedBranch === "all"
        ? "Aggregate View"
        : `Branch ${selectedBranch}`;

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Predicted Busy Hours</CardTitle>
                <CardDescription>
                    Density prediction for: <span className="font-semibold text-teal-600">{branchText}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-64 w-full">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="customers"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.customers > 80 ? "var(--color-customers)" : "#e5e7eb"}
                                />
                            ))}
                        </Bar>
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
