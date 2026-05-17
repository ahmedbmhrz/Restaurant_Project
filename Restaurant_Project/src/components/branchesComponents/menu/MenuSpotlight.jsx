import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function MenuSpotlight({ dish }) {
    if (!dish) return null;

    const isImage = dish.image && (dish.image.startsWith('http') || dish.image.startsWith('/') || dish.image.includes('.'));

    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/10 to-transparent p-5 ring-1 ring-amber-500/20 mb-6 group/dish">
            <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">
                    {isImage ? (
                        <img 
                            src={dish.image} 
                            alt={dish.name} 
                            className="h-12 w-12 rounded-xl object-cover shadow-lg ring-1 ring-white/20"
                        />
                    ) : (
                        dish.image
                    )}
                </div>
                <Badge variant="outline" className="bg-background/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-amber-600 border-amber-500/20">
                    <Star className="h-3.5 w-3.5 fill-amber-500 mr-1.5" />
                    {dish.rating}
                </Badge>
            </div>
            <div>
                <h3 className="text-lg font-black tracking-tight group-hover:text-amber-600 transition-colors uppercase italic">{dish.name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold text-foreground/80">{dish.price}</span>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/60 border-none bg-muted/50">
                        {dish.orders} Orders
                    </Badge>
                </div>
            </div>
        </div>
    )
}
