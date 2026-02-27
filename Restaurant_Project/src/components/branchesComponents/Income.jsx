import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, TrendingUp, Wallet, ReceiptText, Landmark } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

export function Income({ data }) {
    if (!data) return null;

    return (
        <Card className="group relative overflow-hidden border-none bg-linear-to-br from-card to-secondary/30 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:col-span-2">
            {/* Ambient Background Glows */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative flex flex-col lg:flex-row">
                {/* Left Side: Summary Metrics */}
                <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border/50">
                    <CardHeader className="p-0 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 shadow-sm ring-1 ring-emerald-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <Landmark className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Revenue Terminal</CardTitle>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Live Audit</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    {data.trend}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="relative mb-8">
                            <span className="text-sm font-semibold text-muted-foreground ml-1">Total Balance</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-4xl font-black tracking-tighter text-foreground group-hover:text-emerald-500 transition-colors duration-500">
                                    {data.currency}{data.total.toLocaleString()}
                                </span>
                                <span className="text-sm font-bold text-muted-foreground/50">USD</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {data.breakdown.map((item, idx) => (
                                <div key={idx} className="relative overflow-hidden rounded-2xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 hover:bg-background/60 hover:ring-primary/20">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className={`h-1.5 w-8 rounded-full ${item.color}`} />
                                        {idx === 0 ? <Wallet className="h-3.5 w-3.5 text-muted-foreground/50" /> : <ReceiptText className="h-3.5 w-3.5 text-muted-foreground/50" />}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{item.label}</div>
                                    <div className="mt-1 text-sm font-bold">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </div>

                {/* Right Side: Trend Visualization */}
                <div className="flex-1 p-6 bg-muted/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">7-Day Performance</div>
                        <div className="text-[10px] font-medium text-muted-foreground">Rolling Weekly Data</div>
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.history}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    stroke="currentColor"
                                    className="text-[10px] text-muted-foreground/40"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-xl border border-border/50 bg-background/90 p-3 shadow-xl backdrop-blur-md">
                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{payload[0].payload.day}</p>
                                                    <p className="text-sm font-bold text-primary">${payload[0].value.toLocaleString()}</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--color-primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Hit</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
