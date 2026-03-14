
import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, Cell } from "recharts"

const chartConfig = {
    income: {
        label: "Income",
        color: "#00ADB5",
    },
}

export function IncomeBranchTracker() {

    const [chartData, setChartData] = useState([])
    const [activeBranch, setActiveBranch] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/income-branch-tracker')
                const data = await res.json()
                setChartData(data)
                if (data.length > 0) setActiveBranch(data[0])
                setLoading(false)
            } catch (error) {
                console.error("Error fetching branches:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <Card className="flex-none lg:w-3xl h-72 flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
            </Card>
        )
    }

    if (!chartData || chartData.length === 0) {
        return (
            <Card className="flex-none lg:w-3xl h-72 flex items-center justify-center">
                <p className="text-muted-foreground">No branches found.</p>
            </Card>
        )
    }

    return (
        <Card className="flex-none lg:w-3xl">
            <CardHeader>
                <CardTitle className="text-2xl">Income Branch Tracker</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex flex-row items-end justify-between">
                <div className="flex flex-col space-y-2 p-5">
                    <h3 className="text-3xl font-bold">
                        {activeBranch ? activeBranch.increase : "Select a branch"}
                    </h3>
                    <p className="text-sm text-muted-foreground w-32">
                        Branch {activeBranch ? activeBranch.branchName : "--"} vs last month
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
                            onClick={(data) => setActiveBranch(data.payload)}
                            cursor="pointer" // Changes mouse to a hand pointer
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeBranch.branchName === entry.branchName ? "var(--color-income)" : "#e5e7eb"}
                                />


                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

    )
}
