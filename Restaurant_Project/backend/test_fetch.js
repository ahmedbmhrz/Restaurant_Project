import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.meta?.url || import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testFetch() {
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .limit(1)
        .single();

    console.log("Order Keys:", Object.keys(orderData || {}));
}

testFetch();
