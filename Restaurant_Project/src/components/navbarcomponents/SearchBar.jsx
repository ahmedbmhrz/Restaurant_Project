import { useState, useEffect, useRef } from "react"
import { Search, Store, User, Package, Loader2, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

/**
 * SEARCHBAR COMPONENT
 * Provides global search functionality with an interactive dropdown for branches, staff, and products.
 */
export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ branches: [], users: [], products: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Debounced search effect
    useEffect(() => {
        if (!query || query.trim() === '') {
            setResults({ branches: [], users: [], products: [] });
            setIsOpen(false);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        setIsOpen(true);

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleResultClick = (type, item) => {
        setIsOpen(false);
        setQuery("");
        
        let targetBranchIdId = null;
        if (type === 'branch') {
            targetBranchIdId = item.id;
        } else if (type === 'user' && item.branch_id) {
            targetBranchIdId = item.branch_id;
        }

        if (targetBranchIdId) {
            navigate("/branches", { state: { targetBranchId: targetBranchIdId } });
        } else {
            navigate("/branches");
        }
    };

    const hasResults = results.branches.length > 0 || results.users.length > 0 || results.products.length > 0;

    return (
        <div className="flex-1 max-w-md hidden md:flex items-center relative z-50" ref={wrapperRef}>
            <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                    type="search"
                    placeholder="Search branches, staff, or products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.trim() !== '') setIsOpen(true);
                    }}
                    className="pl-10 pr-16 bg-muted/20 border-muted-foreground/20 focus-visible:ring-primary focus-visible:bg-background transition-all rounded-xl w-full"
                />
                
                {isSearching ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary opacity-50" />
                    </div>
                ) : (
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex pointer-events-none">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && query.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {isSearching && !hasResults ? (
                        <div className="p-4 text-center text-xs font-bold text-slate-400 py-8 flex flex-col items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                            Searching database...
                        </div>
                    ) : !hasResults ? (
                        <div className="p-4 text-center text-xs font-bold text-slate-400 py-8">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 space-y-4">
                            
                            {/* Branches Section */}
                            {results.branches.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1">Branches</h3>
                                    <div className="space-y-1">
                                        {results.branches.map(branch => (
                                            <div 
                                                key={branch.id} 
                                                onClick={() => handleResultClick('branch', branch)}
                                                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                                                        <Store className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{branch.name}</div>
                                                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{branch.address}</div>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Staff Section */}
                            {results.users.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1">Staff & Managers</h3>
                                    <div className="space-y-1">
                                        {results.users.map(user => (
                                            <div 
                                                key={user.id} 
                                                onClick={() => handleResultClick('user', user)}
                                                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{user.full_name}</div>
                                                        <div className="text-[10px] text-slate-400">{user.role.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products Section */}
                            {results.products.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1">Menu Items</h3>
                                    <div className="space-y-1">
                                        {results.products.map(product => (
                                            <div 
                                                key={product.id} 
                                                onClick={() => handleResultClick('product', product)}
                                                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{product.name}</div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                            <span>{product.category}</span>
                                                            <span>•</span>
                                                            <span className="font-bold text-emerald-600">${product.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
