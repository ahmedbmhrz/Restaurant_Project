import { useState } from "react"
import { Search } from "lucide-react"
import { ProductItem } from "./ProductItem"

export function ProductList({ products, onUpdateStock, onToggleActive }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="relative group flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                    className="w-full bg-muted/30 border border-border/40 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-10 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <ProductItem
                            key={p.id}
                            product={p}
                            onUpdateStock={onUpdateStock}
                            onToggleActive={onToggleActive}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-[2rem] border border-dashed text-muted-foreground text-sm italic">
                        No matching dishes found in inventory.
                    </div>
                )}
            </div>
        </div>
    );
}
