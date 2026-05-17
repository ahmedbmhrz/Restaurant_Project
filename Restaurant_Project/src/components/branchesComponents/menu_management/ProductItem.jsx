import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Check, RotateCcw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ProductItem({ product, onUpdateStock, onToggleActive }) {
    const [currentStock, setCurrentStock] = useState(product.stock_quantity || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setCurrentStock(product.stock_quantity || 0);
    }, [product.stock_quantity]);

    const hasChanged = currentStock !== product.stock_quantity;

    const handleSave = async () => {
        setIsUpdating(true);
        await onUpdateStock(product.id, currentStock);
        setIsUpdating(false);
    };

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
                <div className="text-right flex flex-col items-end">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground/60 mb-1">
                        Stock Control
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="number"
                            className={`w-14 h-8 bg-background border ${hasChanged ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-border/50'} rounded-lg text-center text-xs font-bold transition-all outline-none`}
                            value={currentStock}
                            onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                        />
                        
                        {hasChanged && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="h-8 w-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <RotateCcw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Update Stock</TooltipContent>
                            </Tooltip>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-lg ${
                                        product.is_active ? "text-amber-500 bg-amber-500/5 hover:bg-amber-500/10" : "text-muted-foreground bg-muted hover:bg-muted/80"
                                    }`}
                                    onClick={() => onToggleActive(product.id, product.is_active)}
                                >
                                    {product.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                {product.is_active ? "Hide Dish" : "Show Dish"}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
