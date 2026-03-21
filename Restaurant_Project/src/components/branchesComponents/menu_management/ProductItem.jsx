import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function ProductItem({ product, onUpdateStock, onToggleActive }) {
    return (
        <div className="group/item flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-transparent hover:border-amber-500/20 hover:bg-muted/40 transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center text-lg shadow-sm overflow-hidden">
                    {product.image_url ? (
                        <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        "🍽️"
                    )}
                </div>
                <div>
                    <div className="text-sm font-bold tracking-tight flex items-center gap-2">
                        {product.name}
                        {!product.is_active && (
                            <Badge variant="secondary" className="h-4 text-[8px] uppercase">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        ${(product.price || 0).toFixed(2)} • {product.category || "General"}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground/60 mb-1">
                        Local Stock
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-16 h-8 bg-background border border-border/50 rounded-lg text-center text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                            defaultValue={product.stock_quantity}
                            onBlur={(e) => onUpdateStock(product.id, e.target.value)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${
                                product.is_active ? "text-amber-500 bg-amber-500/5" : "text-muted-foreground bg-muted"
                            }`}
                            onClick={() => onToggleActive(product.id, product.is_active)}
                        >
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
