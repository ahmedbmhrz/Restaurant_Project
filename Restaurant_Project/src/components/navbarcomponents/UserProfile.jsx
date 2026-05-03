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
import { supabase } from "../../lib/supabase"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { AccountSettingsModal } from "./AccountSettingsModal"
import { BillingModal } from "./BillingModal"
import { IntegrationModal } from "./IntegrationModal"
import { SupportModal } from "./SupportModal"

/**
 * USERPROFILE COMPONENT
 * Renders the user avatar and a dropdown menu for account settings, support, and authentication.
 */
export function UserProfile({ user }) {
    const navigate = useNavigate()
    const [showSettings, setShowSettings] = useState(false)
    const [showBilling, setShowBilling] = useState(false)
    const [showIntegrations, setShowIntegrations] = useState(false)
    const [showSupport, setShowSupport] = useState(false)

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate("/login")
    }

    // Safely extract user info
    const fullName = user?.user_metadata?.full_name || "Nexus User"
    const email = user?.email || "user@nexusfood.com"
    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    const firstName = fullName.split(' ')[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border group ml-1">
                    <div className="hidden lg:block text-right mr-1">
                        <p className="text-[11px] font-bold leading-none text-slate-900">{fullName}</p>
                        <p className="text-[10px] leading-none text-slate-500 mt-1">Administrator</p>
                    </div>
                    <Avatar className="h-8 w-8 ring-2 ring-background group-hover:ring-primary/20 transition-all shadow-sm border border-primary/10">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black shadow-inner">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground mr-1 hidden sm:block opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 shadow-2xl border-primary/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 bg-muted/10">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-slate-900">{fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem 
                        className="cursor-pointer py-2 rounded-lg"
                        onClick={() => setShowSettings(true)}
                    >
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="cursor-pointer py-2 rounded-lg"
                        onClick={() => setShowBilling(true)}
                    >
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Billing & Plan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="cursor-pointer py-2 rounded-lg"
                        onClick={() => setShowIntegrations(true)}
                    >
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Integration Manager</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem 
                        className="cursor-pointer py-2 rounded-lg"
                        onClick={() => setShowSupport(true)}
                    >
                        <LifeBuoy className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Help & Support</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-1">
                    <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2 rounded-lg font-bold"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
            
            <AccountSettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                user={user} 
            />

            <BillingModal 
                isOpen={showBilling} 
                onClose={() => setShowBilling(false)} 
            />

            <IntegrationModal 
                isOpen={showIntegrations} 
                onClose={() => setShowIntegrations(false)} 
            />

            <SupportModal 
                isOpen={showSupport} 
                onClose={() => setShowSupport(false)} 
            />
        </DropdownMenu>
    );
}
