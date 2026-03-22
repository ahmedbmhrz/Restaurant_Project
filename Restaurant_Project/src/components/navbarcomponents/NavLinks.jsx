import { Link, useLocation } from "react-router-dom"

/**
 * NAVLINKS COMPONENT
 * Renders the primary navigation routes with active state highlighting.
 */
export function NavLinks() {
    const location = useLocation();

    // Helper to determine active link styling
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex items-center gap-6 text-sm font-medium ml-auto lg:ml-4">
            <Link 
                to="/home" 
                className={`transition-all hover:text-primary ${isActive('/home') ? 'text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-lg' : 'text-muted-foreground'}`}
            >
                Home
            </Link>
            <Link 
                to="/branches" 
                className={`transition-all hover:text-primary ${isActive('/branches') ? 'text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-lg' : 'text-muted-foreground'}`}
            >
                Branches
            </Link>
            <Link 
                to="/ai-prediction" 
                className={`transition-all hover:text-primary ${isActive('/ai-prediction') ? 'text-primary font-bold bg-primary/5 px-3 py-1.5 rounded-lg' : 'text-muted-foreground'}`}
            >
                AI Prediction
            </Link>
        </div>
    );
}
