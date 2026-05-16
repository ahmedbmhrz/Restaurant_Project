import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtensilsCrossed, Package, Plus } from "lucide-react"

// Modular Sub-components
import { ProductList } from "./menu_management/ProductList"
import { AddProductForm } from "./menu_management/AddProductForm"

export function MenuManagementSheet({ products = [], branchId, refreshData }) {
    
    const handleUpdateStock = async (productId, newStock) => {
        try {
            await fetch('/api/branch-stock', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    branch_id: branchId,
                    product_id: productId,
                    stock_quantity: parseInt(newStock)
                })
            });
            if (refreshData) refreshData();
        } catch (err) {
            console.error("Stock update failed:", err);
        }
    };

    const handleToggleActive = async (productId, currentStatus) => {
        try {
            await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            if (refreshData) refreshData();
        } catch (err) {
            console.error("Status toggle failed:", err);
        }
    };

    const handleAddComplete = () => {
        if (refreshData) refreshData();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest bg-amber-500/5 border-amber-500/20 text-amber-600 hover:bg-amber-500/10 transition-all">
                    <UtensilsCrossed className="h-3 w-3" />
                    Manage Menu
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl border-l-0 shadow-2xl flex flex-col p-0 overflow-hidden" style={{ minWidth: 'min(95vw, 600px)' }}>
                <div className="flex-none p-8 pb-4">
                    <SheetHeader className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="bg-amber-500/10 p-2 rounded-xl text-amber-600">
                                <UtensilsCrossed className="h-5 w-5" />
                             </div>
                             <SheetTitle className="text-2xl font-black uppercase tracking-tight">Inventory Hub</SheetTitle>
                        </div>
                        <SheetDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
                            Global Menu & Local Branch Inventory Control.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <Tabs defaultValue="list" className="flex-1 flex flex-col min-h-0">
                    <div className="px-8 border-b">
                        <TabsList className="bg-muted/50 p-1 rounded-xl h-11 w-full grid grid-cols-2">
                            <TabsTrigger value="list" className="rounded-lg text-[10px] font-black uppercase tracking-widest gap-2">
                                <Package className="h-3 w-3" /> Current Menu
                            </TabsTrigger>
                            <TabsTrigger value="add" className="rounded-lg text-[10px] font-black uppercase tracking-widest gap-2">
                                <Plus className="h-3 w-3" /> Add New Dish
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="list" className="flex-1 min-h-0 overflow-hidden p-8 pt-6">
                        <ProductList 
                            products={products} 
                            onUpdateStock={handleUpdateStock} 
                            onToggleActive={handleToggleActive} 
                            refreshData={refreshData}
                        />
                    </TabsContent>

                    <TabsContent value="add" className="flex-1 overflow-y-auto p-8 pt-6">
                        <AddProductForm 
                            branchId={branchId} 
                            onAddComplete={handleAddComplete} 
                        />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
