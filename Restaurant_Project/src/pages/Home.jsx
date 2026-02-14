import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, XAxis } from "recharts"
const chartData = [
    { branchName: "A", income: 7186, },
    { branchName: "B", income: 3205, },
    { branchName: "C", income: 5037 },
    { branchName: "D", income: 2037 },
    { branchName: "E", income: 9037 },

]
const chartConfig = {
    income: {
        label: "Income",
        color: "#2563eb",
    },
}
/* Circle Background for the text under the bar */
const CircleBackgrund = (props) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            {/* The Circle Background */}
            <circle cx="0" cy="0" r="15" fill="#333" />
            {/* The Text (Centered) */}
            <text
                x="0"
                y="0"
                dy={5}
                textAnchor="middle"
                fill="#fff"
                fontSize={12}

            >
                {payload.value}
            </text>

        </g>
    )
}



function Home() {
    return (
        <div className="min-h-svh flex flex-col bg-muted/90">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight"> Dashboard </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                    <Card className="col-span-3 min-w-3xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Income Branch Tracker</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2 flex flex-row items-end justify-between">
                            <div className="flex flex-col space-y-2 p-5">
                                <h3 className="text-3xl font-bold">10%</h3>
                                <p className="text-sm text-muted-foreground w-32">
                                    Higher than last month
                                </p>
                            </div>
                            <ChartContainer config={chartConfig} className="min-h-52 w-96">
                                <BarChart accessibilityLayer data={chartData}>
                                    <XAxis
                                        dataKey="branchName" // Tells it to use the "branchName" field (A, B, C...)
                                        tickLine={false}// Hides the little tick marks
                                        tickMargin={10}// Adds space between bar and text
                                        axisLine={false}// Hides the bottom line

                                    />
                                    <Bar
                                        dataKey="income"
                                        fill="var(--color-income)"
                                        radius={15}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>

                    </Card>
                </div>

            </main>
        </div>
    )
}

export default Home