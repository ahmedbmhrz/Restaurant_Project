import Dexie from 'dexie';

// Initialize the Offline-First Database
export const db = new Dexie('NexusFood_POS_DB');

// Define the schema
// local_menu: Stores products for offline viewing
// pending_orders: Stores orders that need to be synced to Supabase
db.version(1).stores({
  local_menu: 'id, name, category, price, image_url',
  pending_orders: '++id, timestamp, total_amount, items, status'
});

export default db;
