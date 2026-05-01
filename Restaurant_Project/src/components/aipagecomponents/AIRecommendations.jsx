import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

export function AIRecommendations({ selectedBranch = "all" }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/predict/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        branchId: selectedBranch
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch insights');
                }
                
                const result = await response.json();
                
                // Transform insights into recommendation format
                const transformedRecommendations = result.insights.map((insight, index) => {
                    // Map insights to icons and colors based on content
                    let icon, color;
                    if (insight.includes('traffic') || insight.includes('peak')) {
                        icon = <Users className="h-5 w-5 text-teal-600" />;
                        color = "bg-teal-50";
                    } else if (insight.includes('revenue') || insight.includes('sales')) {
                        icon = <DollarSign className="h-5 w-5 text-green-600" />;
                        color = "bg-green-50";
                    } else if (insight.includes('staff') || insight.includes('server')) {
                        icon = <TrendingUp className="h-5 w-5 text-blue-600" />;
                        color = "bg-blue-50";
                    } else if (insight.includes('inventory') || insight.includes('order')) {
                        icon = <ShoppingBag className="h-5 w-5 text-purple-600" />;
                        color = "bg-purple-50";
                    } else {
                        icon = <AlertTriangle className="h-5 w-5 text-orange-600" />;
                        color = "bg-orange-50";
                    }
                    
                    return {
                        icon,
                        title: insight.split(' ').slice(0, 2).join(' ') || 'AI Insight',
                        description: insight,
                        trend: result.trend || 'AI Generated',
                        color
                    };
                });
                
                setRecommendations(transformedRecommendations);
                setError(null);
            } catch (err) {
                console.error('Insights error:', err);
                setError(err.message);
                // Fallback to mock data
                setRecommendations([
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
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchInsights();
    }, [selectedBranch]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-6 w-6 text-teal-500 fill-teal-500/20" />
                    <h2 className="text-xl font-bold text-slate-800">
                        {selectedBranch === "all" ? "Global Insights" : `Insights for Branch ${selectedBranch}`}
                    </h2>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-teal-500 fill-teal-500/20" />
                <h2 className="text-xl font-bold text-slate-800">
                    {selectedBranch === "all" ? "Global Insights" : `Insights for Branch ${selectedBranch}`}
                    {error && <span className="text-red-500 text-sm ml-2">(Using fallback data)</span>}
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