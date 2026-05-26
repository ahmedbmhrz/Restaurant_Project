import React, { useState, useEffect, useRef } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Minus, ReceiptText, Download, CheckCircle2, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { db } from '../../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

export function TestOrderModal({ isOpen, onOpenChange, branchId, branchName }) {
    const products = useLiveQuery(() => db.products.toArray(), []) || [];
    const [cart, setCart] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Receipt State
    const [completedOrder, setCompletedOrder] = useState(null);
    const receiptRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setCompletedOrder(null);
            setCart({});
        }
    }, [isOpen]);

    const updateQuantity = (productId, delta) => {
        setCart(prev => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);
            const updated = { ...prev, [productId]: next };
            if (next === 0) delete updated[productId];
            return updated;
        });
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        try {
            // Calculate totals
            let subtotal = 0;
            const itemsToInsert = [];
            
            for (const [productId, qty] of Object.entries(cart)) {
                const product = products.find(p => p.id === productId);
                if (product) {
                    subtotal += product.price * qty;
                    itemsToInsert.push({
                        product_id: productId,
                        quantity: qty,
                        price_at_time: product.price,
                        product_name: product.name
                    });
                }
            }

            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            const { data: { session } } = await supabase.auth.getSession();
            const companyId = session?.user?.user_metadata?.company_id;

            // Generate an offline-friendly UUID
            const orderId = crypto.randomUUID();

            // 1. Prepare Order Object
            const orderData = {
                id: orderId,
                branch_id: branchId,
                company_id: companyId || null,
                total_amount: total,
                tax_amount: tax,
                tip_amount: 0,
                status: 'Completed',
                order_type: 'Dine-in',
                created_at: new Date().toISOString()
            };

            // 2. Prepare Items
            const orderItemsInsert = itemsToInsert.map(item => ({
                order_id: orderId,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price_at_time
            }));

            // 3. Prepare Stock Updates
            const productIds = itemsToInsert.map(i => i.product_id);
            const currentStock = await db.branchStock.where('product_id').anyOf(productIds).toArray();
            
            const updatedStock = currentStock.map(stockRow => {
                const orderedItem = itemsToInsert.find(i => i.product_id === stockRow.product_id);
                if (orderedItem) {
                    return {
                        ...stockRow,
                        stock_quantity: Math.max(0, stockRow.stock_quantity - orderedItem.quantity)
                    };
                }
                return stockRow;
            });

            // Write to Local DB Instantly
            await db.orders.add(orderData);
            if (orderItemsInsert.length > 0) {
                await db.orderItems.bulkAdd(orderItemsInsert);
            }
            if (updatedStock.length > 0) {
                await db.branchStock.bulkPut(updatedStock);
            }

            // Push to Sync Queue
            await db.syncQueue.add({
                action: 'CREATE_ORDER',
                payload: {
                    order: orderData,
                    items: orderItemsInsert,
                    stockUpdates: updatedStock
                },
                created_at: new Date().toISOString()
            });

            // Prepare Receipt Data
            setCompletedOrder({
                ...orderData,
                items: itemsToInsert,
                subtotal,
                tax,
                total
            });
            
            setCart({});

        } catch (error) {
            console.error("Error placing test order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const element = receiptRef.current;
            
            // html-to-image uses modern SVG processing which supports Tailwind's oklch colors!
            const imgData = await htmlToImage.toPng(element, { 
                backgroundColor: '#ffffff',
                pixelRatio: 2
            });
            
            // We need to calculate height based on the DOM element size since we bypass canvas
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;
            
            const pdfWidth = 100;
            const pdfHeight = (elementHeight * pdfWidth) / elementWidth;
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Receipt-${completedOrder.id.split('-')[0].toUpperCase()}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF: " + error.message);
        }
    };

    const closeModal = () => {
        onOpenChange(false);
        setTimeout(() => setCompletedOrder(null), 300); // Reset after animation
    };

    const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = products.find(p => p.id === id);
        return sum + (p ? p.price * qty : 0);
    }, 0);
    const cartTax = cartSubtotal * 0.08;
    const cartTotal = cartSubtotal + cartTax;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) closeModal();
        }}>
            <DialogContent className="w-[95vw] sm:max-w-[1600px] h-[85vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[2.5rem]">
                
                {!completedOrder ? (
                    <>
                        {/* POS Header */}
                        <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-slate-800">Create Test Order</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">Select items to generate a live test order for {branchName}.</DialogDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cart Total</div>
                                <div className="text-2xl font-black text-slate-800">${cartTotal.toFixed(2)}</div>
                            </div>
                        </div>

                        {/* POS Body */}
                        <div className="flex-1 overflow-hidden flex">
                            {/* Products List */}
                            <div className="flex-1 bg-white p-6 overflow-y-auto custom-scrollbar">
                                {!products || products.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400 font-bold">
                                        Loading or No Products Available...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {products.map(product => {
                                            const qty = cart[product.id] || 0;
                                            return (
                                                <div key={product.id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 leading-tight">{product.name}</h3>
                                                        <p className="text-sm font-black text-indigo-600 mt-1">${(product.price || 0).toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                                            onClick={() => updateQuantity(product.id, -1)}
                                                            disabled={qty === 0}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="font-bold text-slate-800 w-8 text-center">{qty}</span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                            onClick={() => updateQuantity(product.id, 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Cart Summary */}
                            <div className="w-[360px] bg-slate-50 border-l border-slate-100 flex flex-col">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        Current Order
                                        <Badge className="bg-indigo-100 text-indigo-700">{cartTotalItems}</Badge>
                                    </h3>
                                </div>
                                <ScrollArea className="flex-1 p-6">
                                    {cartTotalItems === 0 ? (
                                        <div className="text-center text-slate-400 text-sm font-medium mt-10">No items selected</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.entries(cart).map(([id, qty]) => {
                                                const p = products.find(p => p.id === id);
                                                if (!p) return null;
                                                return (
                                                    <div key={id} className="flex justify-between items-start text-sm">
                                                        <div className="flex-1 pr-4">
                                                            <span className="font-bold text-slate-800">{qty}x</span> <span className="text-slate-600 font-medium">{p.name}</span>
                                                        </div>
                                                        <div className="font-bold text-slate-800">${(p.price * qty).toFixed(2)}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </ScrollArea>
                                <div className="p-6 bg-white border-t border-slate-100 space-y-3">
                                    <div className="flex justify-between text-sm text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span>${cartSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500 font-medium">
                                        <span>Tax (8%)</span>
                                        <span>${cartTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-100">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <Button 
                                        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide mt-4 shadow-md shadow-indigo-200"
                                        disabled={cartTotalItems === 0 || isSubmitting}
                                        onClick={handlePlaceOrder}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing...</span>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Receipt View */}
                        <div className="flex-1 flex flex-col bg-slate-100">
                            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10 relative">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-800 leading-none">Order Placed!</h2>
                                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Dashboard Updated</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-600 h-10 px-6 hover:bg-slate-50" onClick={closeModal}>
                                        Done
                                    </Button>
                                    <Button className="rounded-xl font-bold bg-slate-900 hover:bg-black text-white h-10 px-6 shadow-md" onClick={downloadPDF}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto flex justify-center py-12 px-4">
                                {/* Thermal Receipt Container */}
                                <div className="bg-white shadow-xl max-w-[420px] w-full p-8 relative font-mono text-sm" ref={receiptRef}>
                                    {/* Jagged top edge simulation (optional visual flair for thermal paper) */}
                                    <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg==')] -mt-2"></div>
                                    
                                    <div className="text-center mb-6 border-b-2 border-dashed border-slate-200 pb-6">
                                        <Building2 className="h-8 w-8 mx-auto mb-2 text-slate-800" />
                                        <h2 className="text-xl font-black uppercase tracking-widest">{branchName}</h2>
                                        <p className="text-xs text-slate-500 mt-1">Nexus Food POS System</p>
                                        <div className="mt-4 text-xs">
                                            <p>Order: #{completedOrder.id.split('-')[0].toUpperCase()}</p>
                                            <p>Date: {new Date(completedOrder.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 border-b-2 border-dashed border-slate-200 pb-6">
                                        <div className="flex justify-between font-bold text-xs uppercase tracking-wider mb-2">
                                            <span>Qty Item</span>
                                            <span>Price</span>
                                        </div>
                                        {completedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                                <div className="flex-1 pr-4">
                                                    <span className="font-bold">{item.quantity}</span> x <span className="uppercase">{item.product_name}</span>
                                                </div>
                                                <div className="font-bold">${(item.price_at_time * item.quantity).toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 mb-6 border-b-2 border-dashed border-slate-200 pb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="uppercase text-slate-500">Subtotal</span>
                                            <span className="font-bold">${completedOrder.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="uppercase text-slate-500">Tax</span>
                                            <span className="font-bold">${completedOrder.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg pt-2 mt-2 border-t border-slate-100">
                                            <span className="uppercase font-black">Total</span>
                                            <span className="font-black">${completedOrder.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="text-center text-xs uppercase tracking-widest text-slate-500 font-bold flex flex-col items-center justify-center">
                                        <ReceiptText className="h-6 w-6 mb-2 opacity-30" />
                                        <p>Thank You</p>
                                        <p>Please Come Again</p>
                                    </div>
                                    
                                    {/* Jagged bottom edge simulation */}
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+')] -mb-2"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
