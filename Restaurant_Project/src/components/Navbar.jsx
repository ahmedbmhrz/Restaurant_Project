import { SearchBar } from "./navbarcomponents/SearchBar"
import { QuickActions } from "./navbarcomponents/QuickActions"
import { NavLinks } from "./navbarcomponents/NavLinks"
import { NotificationCenter } from "./navbarcomponents/NotificationCenter"
import { UserProfile } from "./navbarcomponents/UserProfile"
import { Link } from "react-router-dom"
import { Pizza } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

/**
 * The main header orchestrator for the Nexus Food management platform.
 * Assembles modular sub-components (Brand, Search, Actions, Nav, Notifications, Profile)
 * into a responsive, sticky navigation bar.
 */
export function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get current session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes (login/logout events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto w-full gap-4">
                <Link to="/home" className="flex items-center gap-2 font-bold text-xl mr-4 hover:opacity-90 transition-opacity whitespace-nowrap text-slate-900">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-sm">
                        <Pizza className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:inline">Nexus Food</span>
                </Link>

                {/* Global Search Component */}
                <SearchBar />

                {/* Quick Action Shortcuts */}
                <QuickActions />

                {/* Navigation Routing Links */}
                <NavLinks />

                {/* Right Side Action Hub */}
                <div className="ml-auto flex items-center gap-2">
                    {user ? (
                        <>
                            <NotificationCenter />
                            <UserProfile user={user} />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="font-bold text-slate-600 hidden sm:flex">
                                <Link to="/login">Log In</Link>
                            </Button>
                            <Button asChild className="font-bold shadow-md">
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
