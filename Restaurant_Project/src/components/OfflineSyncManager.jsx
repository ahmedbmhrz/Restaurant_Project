import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { Wifi, WifiOff, RefreshCcw } from 'lucide-react';

export function OfflineSyncManager({ branchId, companyId }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncQueueToSupabase();
            fetchDataToDexie();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial sync on load if online
        if (navigator.onLine && branchId) {
            fetchDataToDexie();
            syncQueueToSupabase();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [branchId, companyId]);

    const fetchDataToDexie = async () => {
        if (!branchId || !companyId) return;
        
        try {
            // 1. Fetch Products
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('company_id', companyId)
                .eq('is_active', true);
                
            if (products) {
                await db.products.bulkPut(products);
            }

            // 2. Fetch Branch Stock
            const { data: stock } = await supabase
                .from('branch_stock')
                .select('*')
                .eq('branch_id', branchId);
                
            if (stock) {
                await db.branchStock.bulkPut(stock);
            }

            // 3. Fetch Recent Orders (Last 50)
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .eq('branch_id', branchId)
                .order('created_at', { ascending: false })
                .limit(50);
                
            if (orders) {
                await db.orders.bulkPut(orders);
                
                // Fetch items for these orders
                const orderIds = orders.map(o => o.id);
                if (orderIds.length > 0) {
                    const { data: orderItems } = await supabase
                        .from('order_items')
                        .select('*')
                        .in('order_id', orderIds);
                        
                    if (orderItems) {
                        // Delete old items then put new to avoid duplicates if running multiple times
                        // A simple approach is just bulkPut if we had a unique key. 
                        // But since orderItems uses ++id locally, we should query by order_id, 
                        // but it's simpler to just store what we fetched.
                        // We will add unique ID to order_items in Dexie if it has one from DB
                        await db.orderItems.bulkPut(orderItems);
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching down to Dexie:', error);
        }
    };

    const syncQueueToSupabase = async () => {
        if (isSyncing) return;
        setIsSyncing(true);

        try {
            const queue = await db.syncQueue.toArray();
            
            for (const task of queue) {
                if (task.action === 'CREATE_ORDER') {
                    const { order, items, stockUpdates } = task.payload;

                    // 1. Insert Order
                    const { data: insertedOrder, error: orderError } = await supabase
                        .from('orders')
                        .insert([order])
                        .select()
                        .single();

                    if (orderError) throw orderError;

                    // 2. Insert Items
                    if (items && items.length > 0) {
                        const itemsToInsert = items.map(item => ({
                            ...item,
                            order_id: insertedOrder.id // Link to real DB ID if needed, but we probably used UUID locally
                        }));
                        await supabase.from('order_items').insert(itemsToInsert);
                    }

                    // 3. Update Stock
                    if (stockUpdates && stockUpdates.length > 0) {
                        await supabase.from('branch_stock').upsert(stockUpdates);
                    }
                }
                
                // Remove task once successfully processed
                await db.syncQueue.delete(task.id);
            }
        } catch (error) {
            console.error('Error syncing queue to Supabase:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border border-slate-100 text-sm font-bold text-slate-600 transition-all">
            {isSyncing ? (
                <><RefreshCcw className="h-4 w-4 animate-spin text-indigo-500" /> Syncing...</>
            ) : isOnline ? (
                <><Wifi className="h-4 w-4 text-emerald-500" /> Online (Synced)</>
            ) : (
                <><WifiOff className="h-4 w-4 text-rose-500" /> Offline Mode</>
            )}
        </div>
    );
}
