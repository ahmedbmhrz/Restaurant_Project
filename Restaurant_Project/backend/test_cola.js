import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.meta?.url || import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkCola() {
    console.log("Checking products table for Cola...");
    const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%cola%');

    if (prodError) {
        console.error("Error:", prodError);
    } else {
        console.log("Cola Products:", JSON.stringify(prodData, null, 2));
    }
}

checkCola();
