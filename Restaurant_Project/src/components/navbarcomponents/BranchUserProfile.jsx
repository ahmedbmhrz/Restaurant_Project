import React, { useState } from 'react';
import { 
    User, 
    Settings, 
    LifeBuoy, 
    LogOut,
    ChevronDown,
    Lock,
    Cpu,
    PhoneCall
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export function BranchUserProfile({ user, branchName }) {
    const navigate = useNavigate()
    const [activeModal, setActiveModal] = useState(null) // 'profile', 'settings', 'support', or null

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error("Sign out error:", e);
        }
        navigate("/branch-login")
    }

    const fullName = user?.user_metadata?.full_name || "Branch Manager"
    const email = user?.email || "manager@nexusfood.com"
    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border group ml-1 outline-none">
                        <div className="hidden lg:block text-right mr-1">
                            <p className="text-[11px] font-bold leading-none text-slate-900">{fullName}</p>
                            <p className="text-[10px] leading-none text-slate-500 mt-1">{branchName || 'Branch Manager'}</p>
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
                    <DropdownMenuLabel className="font-normal p-4 bg-muted/10 rounded-t-md">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none text-slate-900">{fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="p-1">
                        <DropdownMenuItem onClick={() => setActiveModal('profile')} className="cursor-pointer py-2 rounded-lg">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">My Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveModal('settings')} className="cursor-pointer py-2 rounded-lg">
                            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">POS Terminal Settings</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="p-1">
                        <DropdownMenuItem onClick={() => setActiveModal('support')} className="cursor-pointer py-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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

            {/* Profile Modal */}
            <Dialog open={activeModal === 'profile'} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black">
                            <User className="h-6 w-6 text-indigo-500" />
                            Manager Profile
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            View your personal details and access level.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-indigo-500/20">
                            {initials}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">{fullName}</h2>
                        <p className="text-slate-500 font-medium mb-1">{email}</p>
                        <div className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
                            Role: Branch Manager
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* POS Settings Modal */}
            <Dialog open={activeModal === 'settings'} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black">
                            <Cpu className="h-6 w-6 text-slate-700" />
                            Terminal Settings
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Configure this specific hardware terminal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Receipt Printer</h4>
                                <p className="text-xs text-slate-500">Epson TM-T88VI (USB)</p>
                            </div>
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Cash Drawer</h4>
                                <p className="text-xs text-slate-500">Connected via Printer</p>
                            </div>
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">
                            Settings locked by HQ
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* HQ Support Modal */}
            <Dialog open={activeModal === 'support'} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black text-blue-600">
                            <PhoneCall className="h-6 w-6" />
                            HQ Support
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Need help? Head Office is available 24/7.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-5 bg-blue-50 text-blue-900 rounded-2xl flex flex-col gap-2">
                            <h4 className="font-black text-sm uppercase tracking-widest text-blue-500">Emergency Line</h4>
                            <p className="text-2xl font-black">1-800-NEXUS-HQ</p>
                            <p className="text-sm font-medium opacity-80">Option 2 for POS Technical Support</p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl flex flex-col gap-2 border border-slate-100">
                            <h4 className="font-black text-sm uppercase tracking-widest text-slate-500">Email Ticketing</h4>
                            <p className="font-bold text-slate-800">support@nexusfood.com</p>
                            <p className="text-xs font-medium text-slate-500">Typical response time: 15 minutes</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
