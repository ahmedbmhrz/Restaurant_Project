import { 
    Plus, 
    ShoppingBag, 
    UserPlus, 
    Store, 
    PlusCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * QUICKACTIONS COMPONENT
 * A centralized hub for rapid administrative tasks such as adding products, hiring staff, or creating branches.
 */
export function QuickActions() {
    return (
        <div className="hidden sm:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Plus className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-2 px-3">
                        Quick Creation
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Add New Product</span>
                            <span className="text-[10px] text-muted-foreground">Expand your menu</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mr-3">
                            <UserPlus className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Hire New Staff</span>
                            <span className="text-[10px] text-muted-foreground">Manage your team</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 mr-3">
                            <Store className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Create Branch</span>
                            <span className="text-[10px] text-muted-foreground">Grow your empire</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-xs font-medium justify-center py-2 text-primary hover:bg-primary/5">
                        <PlusCircle className="mr-2 h-3 w-3" />
                        View All Actions
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
