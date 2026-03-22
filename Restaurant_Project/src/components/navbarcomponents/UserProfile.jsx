import { 
    User, 
    Settings, 
    CreditCard, 
    LifeBuoy, 
    LogOut,
    ChevronDown
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * USERPROFILE COMPONENT
 * Renders the user avatar and a dropdown menu for account settings, support, and authentication.
 */
export function UserProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border group ml-1">
                    <div className="hidden lg:block text-right mr-1">
                        <p className="text-[11px] font-bold leading-none text-slate-900">Ahmed Bamaherz</p>
                        <p className="text-[10px] leading-none text-slate-500 mt-1">Administrator</p>
                    </div>
                    <Avatar className="h-8 w-8 ring-2 ring-background group-hover:ring-primary/20 transition-all shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed`} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AB</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground mr-1 hidden sm:block opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 shadow-2xl border-primary/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 bg-muted/10">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-slate-900">Ahmed Bamaherz</p>
                        <p className="text-xs leading-none text-muted-foreground">ahmed@nexusfood.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Billing & Plan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Integration Manager</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <LifeBuoy className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Help & Support</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2 rounded-lg font-bold">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
