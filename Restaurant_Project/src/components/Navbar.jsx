import { Link, useLocation } from "react-router-dom"
import { Pizza } from "lucide-react"

/**
 * NAVBAR COMPONENT
 * Provides global navigation across the Nexus Food management platform.
 * Features active route highlighting and persistent header structure.
 */
export function Navbar() {
    const location = useLocation();

    // Helper to determine active link styling
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto w-full">
                {/* Brand Identity */}
                <Link to="/home" className="flex items-center gap-2 font-bold text-xl mr-8 hover:opacity-90 transition-opacity">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Pizza className="h-5 w-5" />
                    </div>
                    <span>Nexus Food</span>
                </Link>

                {/* Primary Navigation Links */}
                <div className="flex items-center gap-8 text-sm font-medium">
                    <Link 
                        to="/home" 
                        className={`transition-all hover:text-primary ${isActive('/home') ? 'text-primary font-semibold border-b-2 border-primary pb-px' : 'text-muted-foreground'}`}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/branches" 
                        className={`transition-all hover:text-primary ${isActive('/branches') ? 'text-primary font-semibold border-b-2 border-primary pb-px' : 'text-muted-foreground'}`}
                    >
                        Branches
                    </Link>
                    <Link 
                        to="/ai-prediction" 
                        className={`transition-all hover:text-primary ${isActive('/ai-prediction') ? 'text-primary font-semibold border-b-2 border-primary pb-px' : 'text-muted-foreground'}`}
                    >
                        AI Prediction
                    </Link>
                </div>

                {/* Optional Right Action Area (Spacer for now) */}
                <div className="ml-auto">
                    <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse border border-slate-300 hidden md:block" />
                </div>
            </div>
        </nav>
    )
}
