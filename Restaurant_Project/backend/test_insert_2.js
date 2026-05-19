import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.meta?.url || import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const KADIKOY_BRANCH_ID = '11111111-1111-1111-1111-111111111111';

async function testInsert() {
    console.log("Testing insert order WITHOUT payment_method...");
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
            branch_id: KADIKOY_BRANCH_ID,
            total_amount: 10.50,
            tax_amount: 0.50,
            tip_amount: 0,
            status: 'Completed',
            order_type: 'Dine-in'
        }])
        .select()
        .single();

    if (orderError) {
        console.error("Order Insert Error:", orderError);
    } else {
        console.log("Order Insert Data:", JSON.stringify(orderData, null, 2));
    }
}

testInsert();
