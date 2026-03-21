import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, DollarSign, Package, Image as ImageIcon } from "lucide-react"

export function AddProductForm({ branchId, onAddComplete }) {
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCategory, setNewCategory] = useState("Food");
    const [newStock, setNewStock] = useState("50");
    const [isSaving, setIsSaving] = useState(false);

    const handleAddProduct = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newName,
                    price: parseFloat(newPrice),
                    category: newCategory,
                    stock_quantity: parseInt(newStock),
                    branch_id: branchId,
                }),
            });
            if (res.ok) {
                onAddComplete();
            }
        } catch (err) {
            console.error("Add product failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Product Name</Label>
                    <input
                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                        placeholder="e.g. Truffle Mushroom Pizza"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase ml-1">Price ($)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                            <input
                                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                                placeholder="0.00"
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold uppercase ml-1">Initial Stock</Label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                            <input
                                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                                placeholder="50"
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase ml-1">Category</Label>
                    <select
                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    >
                        <option value="Food">Food / Main Dish</option>
                        <option value="Drinks">Beverages / Drinks</option>
                        <option value="Desserts">Sweet / Desserts</option>
                        <option value="Sides">Sides / Appetizers</option>
                    </select>
                </div>

                <div className="space-y-1.5 opacity-50 grayscale cursor-not-allowed">
                    <Label className="text-[11px] font-bold uppercase ml-1 flex items-center gap-2">
                        <ImageIcon className="h-3 w-3" /> Image URL (Coming Soon)
                    </Label>
                    <input
                        className="w-full bg-muted border border-border/50 rounded-xl px-4 py-3 text-sm font-medium"
                        placeholder="Paste image link here..."
                        disabled
                    />
                </div>
            </div>

            <Button
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-amber-500/20 bg-amber-600 hover:bg-amber-700 transition-all"
                onClick={handleAddProduct}
                disabled={isSaving || !newName || !newPrice}
            >
                <Plus className="h-5 w-5" />
                Create Global Dish
            </Button>
        </div>
    );
}
