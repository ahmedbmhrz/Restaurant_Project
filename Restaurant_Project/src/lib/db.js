import Dexie from 'dexie';

export const db = new Dexie('NexusPOS');

db.version(1).stores({
  // Tables
  products: 'id, name, price, company_id, is_active',
  orders: 'id, branch_id, company_id, status, created_at, total_amount', // local id can be UUID
  orderItems: '++id, order_id, product_id, quantity, unit_price',
  branchStock: 'id, branch_id, product_id, stock_quantity',
  
  // Sync Queue: stores operations that need to be pushed to Supabase when online
  syncQueue: '++id, action, payload, created_at' 
});
