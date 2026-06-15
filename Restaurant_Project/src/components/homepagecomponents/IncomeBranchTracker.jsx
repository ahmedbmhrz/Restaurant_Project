import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, Cell } from "recharts"
import { TrendingUp, MapPin } from "lucide-react"

const chartConfig = {
    income: {
        label: "Income",
        color: "#00ADB5",
    },
}

export function IncomeBranchTracker() {
    const navigate = useNavigate()
    const [chartData, setChartData] = useState([])
    const [activeBranch, setActiveBranch] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/stats/income-branch-tracker')
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
            <div className="lg:w-2/3 h-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl">
                <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <p className="text-sm font-bold text-slate-500">Loading chart data...</p>
                </div>
            </div>
        )
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="lg:w-2/3 h-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl">
                <p className="text-sm font-bold text-slate-500">No branches found.</p>
            </div>
        )
    }

    return (
        <div className="lg:w-2/3 flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Income Branch Tracker</h2>
                        <p className="text-xs font-medium text-slate-500">Revenue for {new Date().toLocaleString('default', { month: 'long' })}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between p-6 gap-8">
                
                {/* Left Side: Stats */}
                <div className="flex flex-col space-y-2 p-6 bg-white/60 rounded-3xl border border-white/60 shadow-sm min-w-[220px]">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {activeBranch ? activeBranch.fullName : "Select a branch"}
                        </p>
                    </div>
                    <h3 className="text-5xl font-black text-slate-800 tracking-tighter">
                        ${activeBranch ? activeBranch.income.toLocaleString() : "0"}
                    </h3>
                    <div className="flex items-center gap-2 mt-4">
                        <span className={`text-sm font-bold ${activeBranch?.increase?.includes('-') ? 'text-red-600 bg-red-500/10' : 'text-emerald-600 bg-emerald-500/10'} px-3 py-1 rounded-full flex items-center gap-1`}>
                            <TrendingUp className={`h-3 w-3 ${activeBranch?.increase?.includes('-') ? 'rotate-180' : ''}`} />
                            {activeBranch ? activeBranch.increase : "0%"}
                        </span>
                        <p className="text-xs font-medium text-slate-400 italic">
                            vs. previous month
                        </p>
                    </div>
                </div>

                {/* Right Side: Chart */}
                <div className="flex-1 w-full h-full min-h-[220px] flex items-end">
                    <ChartContainer config={chartConfig} className="w-full h-full max-h-[260px]">
                        <BarChart accessibilityLayer data={chartData} margin={{ top: 20, bottom: 20 }}>
                            <XAxis
                                dataKey="branchName"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={({ x, y, payload }) => {
                                    return (
                                        <text
                                            x={x}
                                            y={y + 15}
                                            textAnchor="middle"
                                            fill="#94a3b8"
                                            className="text-[10px] font-bold cursor-pointer transition-colors"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                const branch = chartData.find(b => b.branchName === payload.value);
                                                if (branch && branch.id) {
                                                    navigate('/branches', { state: { targetBranchId: branch.id } });
                                                }
                                            }}
                                            onMouseEnter={(e) => e.target.setAttribute('fill', '#00ADB5')}
                                            onMouseLeave={(e) => e.target.setAttribute('fill', '#94a3b8')}
                                        >
                                            {payload.value}
                                        </text>
                                    );
                                }}
                            />
                            <Bar
                                dataKey="income"
                                fill="var(--color-income)"
                                radius={[8, 8, 8, 8]}
                                barSize={40}
                                onClick={(data) => setActiveBranch(data.payload)}
                                cursor="pointer"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={activeBranch?.id === entry.id ? "var(--color-income)" : "rgba(0, 173, 181, 0.15)"}
                                        className="transition-all duration-300 hover:opacity-80"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    )
}
