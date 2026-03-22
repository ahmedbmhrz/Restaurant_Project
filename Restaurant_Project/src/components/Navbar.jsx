import { SearchBar } from "./navbarcomponents/SearchBar"
import { QuickActions } from "./navbarcomponents/QuickActions"
import { NavLinks } from "./navbarcomponents/NavLinks"
import { NotificationCenter } from "./navbarcomponents/NotificationCenter"
import { UserProfile } from "./navbarcomponents/UserProfile"
import { Link } from "react-router-dom"
import { Pizza } from "lucide-react"

/**
 * The main header orchestrator for the Nexus Food management platform.
 * Assembles modular sub-components (Brand, Search, Actions, Nav, Notifications, Profile)
 * into a responsive, sticky navigation bar.
 */
export function Navbar() {
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
                    <NotificationCenter />
                    <UserProfile />
                </div>
            </div>
        </nav>
    );
}
