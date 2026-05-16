import { BranchNotificationCenter } from "./navbarcomponents/BranchNotificationCenter"
import { BranchUserProfile } from "./navbarcomponents/BranchUserProfile"
import { Pizza } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

export function BranchNavbar({ branchName }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                // FALLBACK MOCK USER since we are using a mock login flow
                setUser({ email: 'manager@kadikoy.com', user_metadata: { full_name: 'Branch Manager' } });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto w-full gap-4">
                
                {/* Brand & Branch Name */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm">
                        <Pizza className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-sm text-slate-800 leading-none">Nexus Food</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{branchName || 'Branch'} Portal</span>
                    </div>
                </div>

                {/* Right Side - Just Profile & Notifications */}
                <div className="ml-auto flex items-center gap-2">
                    {user ? (
                        <>
                            <BranchNotificationCenter />
                            <BranchUserProfile user={user} branchName={branchName} />
                        </>
                    ) : (
                        <Button asChild variant="ghost" className="font-bold text-slate-600">
                            <Link to="/login">Log In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
