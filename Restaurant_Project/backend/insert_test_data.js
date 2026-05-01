import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function addTestData() {
    console.log("🚀 Injecting a massive spike of test data...");
    
    // We'll attach this to the first branch "Branch A"
    const branchId = '11111111-1111-1111-1111-111111111111';
    const newOrders = [];
    
    // Create a massive spike TODAY at exactly 8:00 AM
    const today = new Date();
    today.setHours(8, 0, 0, 0); 
    
    for (let i = 0; i < 50; i++) {
        newOrders.push({
            branch_id: branchId,
            total_amount: 1500.00, // Very high amount to ensure a huge spike
            status: 'Completed',
            created_at: today.toISOString()
        });
    }
    
    const { error } = await supabase.from('orders').insert(newOrders);
    
    if (error) {
        console.error("❌ Error inserting test data:", error);
    } else {
        console.log(`✅ Successfully added 50 massive orders at 8:00 AM today!`);
        console.log(`💰 Total value added: $75,000`);
        console.log(`👉 Go refresh your React page and look at the charts!`);
    }
}

addTestData();
