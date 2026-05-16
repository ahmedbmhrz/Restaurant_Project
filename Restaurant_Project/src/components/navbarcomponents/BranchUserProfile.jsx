import { 
    User, 
    Settings, 
    LifeBuoy, 
    LogOut,
    ChevronDown,
    Lock
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

export function BranchUserProfile({ user }) {
    const navigate = useNavigate()

    const handleSignOut = () => {
        // Just mock signing out by navigating back to the branch login
        navigate("/branch-login")
    }

    const fullName = user?.user_metadata?.full_name || "Branch Manager"
    const email = user?.email || "manager@nexusfood.com"
    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border group ml-1">
                    <div className="hidden lg:block text-right mr-1">
                        <p className="text-[11px] font-bold leading-none text-slate-900">{fullName}</p>
                        <p className="text-[10px] leading-none text-slate-500 mt-1">On Duty</p>
                    </div>
                    <Avatar className="h-8 w-8 ring-2 ring-background group-hover:ring-primary/20 transition-all shadow-sm border border-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-black shadow-inner">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground mr-1 hidden sm:block opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 shadow-2xl border-primary/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 bg-muted/10">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-slate-900">{fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">POS Terminal Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="cursor-pointer py-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span className="font-medium text-sm">Contact HQ Support</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1">
                    <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2 rounded-lg font-bold"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Lock Terminal</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
