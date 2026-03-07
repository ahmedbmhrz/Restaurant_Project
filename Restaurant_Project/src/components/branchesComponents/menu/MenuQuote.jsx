import { UtensilsCrossed } from "lucide-react"

export function MenuQuote() {
    return (
        <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/10 relative overflow-hidden group/quote mt-8">
            <div className="absolute -right-2 -top-2 opacity-10 rotate-12 transition-transform duration-500 group-hover/quote:scale-150">
                <UtensilsCrossed className="h-12 w-12 text-amber-600" />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80 italic font-medium relative z-10 uppercase tracking-tighter">
                "Innovation is the secret ingredient that turns a menu into a legend."
            </p>
        </div>
    )
}
