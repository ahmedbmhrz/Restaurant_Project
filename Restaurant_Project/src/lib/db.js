import Dexie from 'dexie';

export const db = new Dexie('NexusPOS');

db.version(1).stores({
  products: 'id, name, price, company_id, is_active',
  orders: 'id, branch_id, company_id, status, created_at, total_amount',
  orderItems: '++id, order_id, product_id, quantity, unit_price',
  branchStock: 'id, branch_id, product_id, stock_quantity',
  syncQueue: '++id, action, payload, created_at' 
});

db.version(2).stores({
  branchStock: null // Drop the table with the bad primary key
});

db.version(3).stores({
  products: 'id, name, price, company_id, is_active',
  orders: 'id, branch_id, company_id, status, created_at, total_amount',
  orderItems: '++id, order_id, product_id, quantity, unit_price',
  branchStock: '[branch_id+product_id], branch_id, product_id, stock_quantity',
  syncQueue: '++id, action, payload, created_at' 
});
