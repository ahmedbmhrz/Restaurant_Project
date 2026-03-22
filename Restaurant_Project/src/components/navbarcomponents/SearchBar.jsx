import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

/**
 * SEARCHBAR COMPONENT
 * Provides global search functionality with an interactive input and a keyboard shortcut hint.
 */
export function SearchBar() {
    return (
        <div className="flex-1 max-w-md hidden md:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
                type="search"
                placeholder="Search branches, staff, or products..."
                className="pl-10 pr-16 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary focus-visible:bg-background transition-all rounded-xl"
            />
            <kbd className="absolute right-3 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex pointer-events-none">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
    );
}
