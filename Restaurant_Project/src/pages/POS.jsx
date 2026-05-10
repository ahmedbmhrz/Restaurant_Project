import React, { useState, useEffect } from 'react';
import { db } from '../db/posDB';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
    ShoppingCart, 
    Wifi, 
    WifiOff, 
    PackageCheck, 
    RefreshCw, 
    Search,
    ChevronRight,
    Trash2,
    Plus,
    Minus,
    Store
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import supabase from '../lib/supabase';

export function POSPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    // Dexie Live Queries
    const menuItems = useLiveQuery(() => db.local_menu.toArray());
    const pendingOrdersCount = useLiveQuery(() => db.pending_orders.where('status').equals('pending_sync').count());

    // Monitor Online Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sync Menu from Supabase to IndexedDB
    const syncMenu = async () => {
        if (!isOnline) return;
        setIsSyncing(true);
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            
            await db.local_menu.clear();
            await db.local_menu.bulkAdd(data);
            console.log("Menu synced to local storage!");
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setIsSyncing(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const order = {
            items: cart,
            total_amount: cart.reduce((sum, i) => sum + (i.price * i.qty), 0),
            timestamp: new Date().toISOString(),
            status: 'pending_sync'
        };

        try {
            await db.pending_orders.add(order);
            setCart([]);
            // Logic for background sync would go here
        } catch (err) {
            console.error("Checkout failed:", err);
        }
    };

    const filteredMenu = menuItems?.filter(p => {
        const matchesCat = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    return (
        <div className="h-screen flex bg-[#f8fafc] overflow-hidden font-sans selection:bg-indigo-100">
            {/* Left: Menu Section */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Store className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Nexus POS</h1>
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {isOnline ? 'Network Online' : 'Offline Mode Active'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {pendingOrdersCount > 0 && (
                            <Badge variant="outline" className="h-10 px-4 rounded-xl border-amber-200 bg-amber-50 text-amber-700 font-bold flex gap-2 animate-pulse">
                                <RefreshCw className="h-3 w-3" />
                                {pendingOrdersCount} SYNC PENDING
                            </Badge>
                        )}
                        <Button 
                            variant="outline" 
                            onClick={syncMenu}
                            disabled={isSyncing || !isOnline}
                            className="h-12 px-6 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-white hover:shadow-md transition-all gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            Sync Menu
                        </Button>
                    </div>
                </header>

                {/* Search & Categories */}
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                            placeholder="Quick search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 pl-12 bg-white border-none shadow-sm rounded-2xl text-base font-medium focus-visible:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl">
                        {['All', 'Food', 'Drinks', 'Desserts'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {filteredMenu?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 opacity-50 italic">
                            <PackageCheck className="h-16 w-16 mb-4" />
                            <p>No products available locally. Please sync from cloud.</p>
                        </div>
                    ) : (
                        filteredMenu?.map(product => (
                            <div 
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="h-36 w-full bg-slate-50 rounded-3xl mb-4 overflow-hidden relative">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-4xl">🍔</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="px-2">
                                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{product.category}</p>
                                </div>
                                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-active:opacity-10 transition-opacity" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right: Cart Sidebar */}
            <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">New Order</h2>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCart([])}
                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                        Reset
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                            <ShoppingCart className="h-20 w-20 mb-6" />
                            <p className="text-sm font-bold uppercase tracking-widest">Cart is Empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 group transition-all hover:bg-slate-50">
                                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">🥗</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                                    <p className="text-xs font-black text-indigo-600 mt-0.5">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-sm border border-slate-100">
                                    <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="text-xs font-black text-slate-700 min-w-[20px] text-center">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                            <span>Taxes (Included)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="h-px bg-slate-200/50" />
                        <div className="flex justify-between items-end px-2 pt-2">
                            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Grand Total</span>
                            <span className="text-5xl font-black text-slate-900 leading-none tracking-tighter">
                                <span className="text-2xl mr-1 opacity-40">$</span>
                                {total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button 
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                        className="w-full h-20 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] gap-4"
                    >
                        <PackageCheck className="h-7 w-7" />
                        PLACE ORDER
                        <ChevronRight className="h-5 w-5 opacity-40" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
