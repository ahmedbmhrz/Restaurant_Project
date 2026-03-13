
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, ShoppingBag } from "lucide-react"

const recommendations = [
    {
        icon: <Users className="h-5 w-5 text-teal-600" />,
        title: "Staff Optimization",
        description: "AI predicts 30% higher traffic this Friday evening. Consider adding 2 more servers.",
        trend: "+30% traffic",
        color: "bg-teal-50"
    },
    {
        icon: <ShoppingBag className="h-5 w-5 text-blue-600" />,
        title: "Inventory Alert",
        description: "Predicted demand for 'Signature Pizza' is rising. Order 15% more fresh dough ingredients.",
        trend: "+15% demand",
        color: "bg-blue-50"
    },
    {
        icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
        title: "Promo Opportunity",
        description: "Tuesday lunch hours are projected to be slow. Launch a 'Happy Hour' 2-for-1 offer.",
        trend: "Revenue gap detected",
        color: "bg-purple-50"
    }
]

export function AIRecommendations({ selectedBranch = "all" }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-teal-500 fill-teal-500/20" />
                <h2 className="text-xl font-bold text-slate-800">
                    {selectedBranch === "all" ? "Global Insights" : `Insights for Branch ${selectedBranch}`}
                </h2>
            </div>

            <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                    <Card key={index} className="overflow-hidden border-teal-100/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className={`${rec.color} py-3`}>
                            <div className="flex items-center gap-3">
                                {rec.icon}
                                <CardTitle className="text-sm font-semibold">{rec.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-slate-600 leading-relaxed mb-2">
                                {rec.description}
                            </p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-1 rounded">
                                {rec.trend}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
