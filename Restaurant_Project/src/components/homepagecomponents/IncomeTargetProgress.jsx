import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"



export function IncomeTargetProgress() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Income target progress</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed" >you need to have total of 17500$ income per month to
                    reach this year target </p>

                <div className="w-full max-w-sm space-y-2 pt-9">
                    <div className="flex justify-between text-sm font-medium">
                        <label htmlFor="progress-upload">Upload progress</label>
                        <span className="text-muted-foreground">66%</span>
                    </div>
                    <Progress value={66} className="h-7 [&>*]:bg-[#00ADB5]" id="progress-upload" />
                </div>
            </CardContent>
        </Card>

    )
}
