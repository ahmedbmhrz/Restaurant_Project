import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

export function AIRecommendations({ selectedBranch = "all", branchName = "All Branches" }) {
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
                
                // Transform structured insights
                const transformedRecommendations = result.insights.map((insight, index) => {
                    let icon, color, textColor;
                    
                    // Assign colors based on severity
                    if (insight.severity === 'positive') {
                        color = "bg-emerald-50 border-emerald-100";
                        textColor = "text-emerald-700";
                    } else if (insight.severity === 'negative') {
                        color = "bg-rose-50 border-rose-100";
                        textColor = "text-rose-700";
                    } else if (insight.severity === 'warning') {
                        color = "bg-amber-50 border-amber-100";
                        textColor = "text-amber-700";
                    } else {
                        color = "bg-slate-50 border-slate-100";
                        textColor = "text-slate-700";
                    }
                    
                    // Assign icon based on type
                    if (insight.type === 'revenue') {
                        icon = <DollarSign className={`h-5 w-5 ${textColor}`} />;
                    } else if (insight.type === 'staffing' || insight.type === 'traffic') {
                        icon = <Users className={`h-5 w-5 ${textColor}`} />;
                    } else if (insight.type === 'inventory') {
                        icon = <ShoppingBag className={`h-5 w-5 ${textColor}`} />;
                    } else {
                        icon = <Sparkles className={`h-5 w-5 ${textColor}`} />;
                    }
                    
                    return {
                        ...insight,
                        icon,
                        color,
                        textColor
                    };
                });
                
                setRecommendations(transformedRecommendations);
                setError(null);
            } catch (err) {
                console.error('Insights error:', err);
                setError(err.message);
                // Fallback to mock structured data
                setRecommendations([
                    {
                        icon: <Users className="h-5 w-5 text-amber-700" />,
                        title: "Unusual Traffic Spike",
                        description: "Expected traffic at 18:00 is 120% higher than your historical average.",
                        action: "Review Shift Schedule",
                        trend: "▲ +120% Spike",
                        color: "bg-amber-50 border-amber-100",
                        textColor: "text-amber-700"
                    },
                    {
                        icon: <ShoppingBag className="h-5 w-5 text-slate-700" />,
                        title: "Stock Optimization",
                        description: "Your highest revenue day this week is projected to hit $5,200.",
                        action: "Check Inventory Levels",
                        trend: "Action Required",
                        color: "bg-slate-50 border-slate-100",
                        textColor: "text-slate-700"
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
                        {selectedBranch === "all" ? "Global Insights" : `Insights for ${branchName}`}
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
                    {selectedBranch === "all" ? "Global Insights" : `Insights for ${branchName}`}
                    {error && <span className="text-red-500 text-sm ml-2">(Fallback: {error})</span>}
                </h2>
            </div>

            <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                    <Card key={index} className={`overflow-hidden border shadow-sm hover:shadow-md transition-shadow ${rec.color}`}>
                        <CardHeader className="py-3 pb-2">
                            <div className="flex items-center gap-3">
                                {rec.icon}
                                <CardTitle className={`text-sm font-bold ${rec.textColor}`}>{rec.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3 mt-1">
                                {rec.description}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/60 ${rec.textColor}`}>
                                    {rec.trend}
                                </span>
                                {rec.action && (
                                    <button className={`text-xs font-semibold flex items-center gap-1 hover:underline ${rec.textColor}`}>
                                        {rec.action}
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}