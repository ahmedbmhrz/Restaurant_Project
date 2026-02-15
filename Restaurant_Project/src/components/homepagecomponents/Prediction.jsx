
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function Prediction() {
    return (
        <Card className="flex-1 flex flex-col bg-gray-300 border-1 border-black ">
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


    )
}
