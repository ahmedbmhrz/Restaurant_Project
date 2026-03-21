import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seedData() {
    console.log("🚀 Starting ESM data seed...");

    const branchIds = [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        'cccc3333-3333-3333-3333-333333333333',
        'aaaa1111-1111-1111-1111-111111111111',
        'bbbb2222-2222-2222-2222-222222222222'
    ];

    // 1. Seed Products if empty
    const { data: existingProducts } = await supabase.from('products').select('id');
    if (existingProducts.length < 5) {
        console.log("📦 Seeding products...");
        const products = [
            { name: "Signature Burger", price: 18.50, category: "Food" },
            { name: "Truffle Pizza", price: 24.00, category: "Food" },
            { name: "Craft Cola", price: 4.50, category: "Drinks" },
            { name: "Iced Latte", price: 5.50, category: "Drinks" },
            { name: "Chocolate Fondant", price: 12.00, category: "Desserts" }
        ];
        await supabase.from('products').insert(products);
    }

    // 2. Fetch all products to link stock
    const { data: products } = await supabase.from('products').select('id');

    // 3. Seed Branch Stock
    console.log("🏪 Seeding branch stock...");
    const stockToInsert = [];
    branchIds.forEach(bId => {
        products.forEach(p => {
            stockToInsert.push({
                branch_id: bId,
                product_id: p.id,
                stock_quantity: Math.floor(Math.random() * 100) + 10
            });
        });
    });
    await supabase.from('branch_stock').upsert(stockToInsert);

    // 4. Seed Orders for the last 7 days
    console.log("🧾 Seeding historical orders...");
    const orderToInsert = [];
    branchIds.forEach(bId => {
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Random number of orders per day
            const dailyOrders = Math.floor(Math.random() * 10) + 5;
            for (let j = 0; j < dailyOrders; j++) {
                orderToInsert.push({
                    branch_id: bId,
                    total_amount: Math.floor(Math.random() * 200) + 50,
                    status: 'Completed',
                    created_at: date.toISOString()
                });
            }
        }
    });
    await supabase.from('orders').insert(orderToInsert);

    console.log("✅ ESM Seed completed successfully!");
}

seedData().catch(err => {
    console.error("❌ ESM Seed failed:", err);
    process.exit(1);
});
