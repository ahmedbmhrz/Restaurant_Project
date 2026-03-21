import { Badge } from "@/components/ui/badge"
import { TrendingUp, ChevronRight } from "lucide-react"

export function SignatureJewels({ items }) {
    if (!items) return null;

    return (
        <div className="flex-1 p-6 bg-muted/20">
            <div className="flex items-center justify-between mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Signature Jewels</div>
                <TrendingUp className="h-4 w-4 text-amber-500/50" />
            </div>

            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="group/item relative flex items-center justify-between rounded-2xl bg-background/40 p-3 ring-1 ring-border/50 transition-all duration-300 hover:bg-background/80 hover:ring-amber-500/30 hover:shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-xl font-bold transition-transform group-hover/item:scale-110 overflow-hidden ring-1 ring-border/50">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                ) : (
                                    idx + 1
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-bold tracking-tight">{item.name}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-medium text-muted-foreground">{item.orders} Orders</span>
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                    <Badge variant="outline" className="h-4 text-[8px] font-black uppercase tracking-tighter border-none bg-amber-500/5 text-amber-600">
                                        {item.status}
                                    </Badge>
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                    <span className={`text-[10px] font-bold ${item.stock_quantity <= 5 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                                        {item.stock_quantity} In Stock
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-foreground/80">{item.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
