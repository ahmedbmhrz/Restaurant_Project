import { useState } from "react"
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
import { Bar, BarChart, XAxis, Cell } from "recharts"
import { Info } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TriangleAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const notifications = [
    {
        title: "Heads up!",
        description: "hello there hello",
        time: "Just now",
        color: "bg-[#D9D9D9]",
        action: true
    },
    {
        title: "New Order",
        description: "Table 5 placed an order",
        time: "2m ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "Payment Received",
        description: "Order #1234 paid successfully",
        time: "15m ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "Shift Change",
        description: "Evening shift starts in 30 mins",
        time: "1h ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "System Update",
        description: "System maintenance at midnight",
        time: "4h ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "System Update",
        description: "System maintenance at midnight",
        time: "4h ago",
        color: "bg-[#D9D9D9]"
    }


]

const chartData = [
    { branchName: "A", income: 7186, increase: "+10%" },
    { branchName: "B", income: 3205, increase: "+5%" },
    { branchName: "C", income: 5037, increase: "+12%" },
    { branchName: "D", income: 2037, increase: "-2%" },
    { branchName: "E", income: 9037, increase: "+20%" },
    { branchName: "F", income: 6400, increase: "+15%" },
    { branchName: "G", income: 4200, increase: "+8%" },

]
const chartConfig = {
    income: {
        label: "Income",
        color: "#00ADB5",
    },
}



function Home() {
    const [activeBranch, setActiveBranch] = useState(chartData[0])

    return (
        <div className="min-h-svh flex flex-col bg-muted/90">
            <Navbar />
            <main className="flex-1 p-6 md:p-10 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
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
                    <div className="flex-1">
                        <h2>Notification</h2>
                        <ScrollArea className="h-[300px] w-full rounded-md border-2 p-4">
                            <div className="flex flex-col gap-4">
                                {notifications.map((notification, index) => (
                                    <Alert
                                        key={index}
                                        className={`${notification.color} text-black border-none shadow-sm`}
                                    >
                                        <TriangleAlert />

                                        <AlertTitle className="flex justify-between items-center">
                                            {notification.title}
                                            <span className="text-xs font-normal opacity-70">
                                                {notification.time}
                                            </span>
                                        </AlertTitle>
                                        <AlertDescription>
                                            {notification.description}

                                        </AlertDescription>

                                    </Alert>
                                ))}
                            </div>
                        </ScrollArea>

                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-4">Branch Manager</h2>
                        <ScrollArea className="h-48 w-full rounded-md border-2 p-4">
                            <div className="flex flex-col gap-6">
                                <Card className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <h4 className="font-semibold"> Ahmed</h4>
                                            <p className="text-muted-foreground">Manger</p>
                                        </div>

                                        <Button variant="outline">Profile</Button>
                                    </div>
                                    <div className="mt-2 text-muted-foreground">
                                        this manger has increased income for barnh A by 10%
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <h4 className="font-semibold"> Ahmed</h4>
                                            <p className="text-muted-foreground">Manger</p>
                                        </div>

                                        <Button variant="outline">Profile</Button>
                                    </div>
                                    <div className="mt-2 text-muted-foreground">
                                        this manger has increased income for barnh A by 10%
                                    </div>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>
                    <Card className="flex-1 flex flex-col bg-gray-300 border-1 border-black">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">
                                Prediction
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between flex-1 gap-4">
                            <div className="bg-muted/80 p-4 rounded-lg border">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Branch A and C are projected to have better income next month based on current trends.
                                </p>
                            </div>
                            <Button variant="secondary" className="w-full justify-between bg-muted/80">
                                More predictions
                                <span className="text-xs opacity-50">→</span>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex-1">
                        <CardContent>hello there </CardContent>
                    </Card>
                </div>




            </main>
        </div>
    )
}

export default Home