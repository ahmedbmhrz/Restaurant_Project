import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.meta?.url || import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testInsertItems() {
    console.log("Testing insert order items...");
    
    // Use the ID we just created
    const orderId = "644cc76c-32b7-4045-bb79-595ad514dc10";
    
    // We need a real product_id from the database
    const { data: prodData } = await supabase.from('products').select('id').limit(1).single();
    const productId = prodData.id;

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert([{
            order_id: orderId,
            product_id: productId,
            quantity: 1
        }]);

    if (itemsError) {
        console.error("Order Items Insert Error:", itemsError);
    } else {
        console.log("Order Items Insert SUCCESS!");
    }
}

testInsertItems();
