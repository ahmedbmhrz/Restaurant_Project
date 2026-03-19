import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"


export function IncomeTargetProgress() {
    const [progressData, setProgressData] = useState(null)
    const [loading, setLoading] = useState(true)
    // 2. Fetch the data right when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/income-target')
                const data = await res.json()
                setProgressData(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching target progress:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    if (loading || !progressData) return <Card className="flex-1"><CardContent className="pt-6">Loading progress...</CardContent></Card>;


    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Income target progress</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Dynamically display the target amount using progressData.target */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You need to have a total of ${progressData.target.toLocaleString()} income per month to reach this year's target.
                </p>
                <div className="w-full max-w-sm space-y-2 pt-9">
                    <div className="flex justify-between text-sm font-medium">
                        {/* Display the current tracked amount */}
                        <label htmlFor="progress-upload">Current: ${progressData.current.toLocaleString()}</label>
                        {/* Display the percentage text */}
                        <span className="text-muted-foreground">{progressData.percentage}%</span>
                    </div>
                    {/* Pass the percentage number to the Progress bar so it fills up properly! */}
                    <Progress value={progressData.percentage} className="h-7 [&>*]:bg-[#00ADB5]" id="progress-upload" />
                </div>
            </CardContent>
        </Card>
    )
}
