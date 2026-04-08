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

    // Add this after the branchIds array
const branchProfiles = {
    '11111111-1111-1111-1111-111111111111': {
        name: 'Downtown Branch',
        type: 'urban',
        size: 'large',
        avgOrderValue: 45,
        dailyOrders: 25,
        peakHours: [12, 13, 18, 19, 20],
        popularProducts: ['Truffle Pizza', 'Craft Cola']
    },
    '22222222-2222-2222-2222-222222222222': {
        name: 'Suburban Branch', 
        type: 'suburban',
        size: 'medium',
        avgOrderValue: 35,
        dailyOrders: 15,
        peakHours: [11, 12, 17, 18],
        popularProducts: ['Signature Burger', 'Iced Latte']
    },
    'cccc3333-3333-3333-3333-333333333333': {
        name: 'Mall Branch',
        type: 'mall',
        size: 'large', 
        avgOrderValue: 40,
        dailyOrders: 30,
        peakHours: [11, 12, 13, 14, 15, 16, 17, 18, 19],
        popularProducts: ['Chocolate Fondant', 'Craft Cola']
    },
    'aaaa1111-1111-1111-1111-111111111111': {
        name: 'Airport Branch',
        type: 'airport',
        size: 'small',
        avgOrderValue: 25,
        dailyOrders: 20,
        peakHours: [6, 7, 8, 17, 18, 19, 20, 21],
        popularProducts: ['Iced Latte', 'Craft Cola']
    },
    'bbbb2222-2222-2222-2222-222222222222': {
        name: 'Campus Branch',
        type: 'campus',
        size: 'medium',
        avgOrderValue: 30,
        dailyOrders: 18,
        peakHours: [8, 9, 11, 12, 13, 17, 18],
        popularProducts: ['Signature Burger', 'Iced Latte']
    }
};

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
    const profile = branchProfiles[bId];
    const baseStock = profile.size === 'large' ? 50 : profile.size === 'medium' ? 30 : 20;
    
    products.forEach(p => {
        // Adjust stock based on branch preferences
        let stockQuantity = Math.floor(Math.random() * baseStock) + 10;
        
        // Boost stock for popular products
        if (profile.popularProducts.includes(p.name)) {
            stockQuantity = Math.floor(stockQuantity * 1.5);
        }
        
        stockToInsert.push({
            branch_id: bId,
            product_id: p.id,
            stock_quantity: stockQuantity
        });
    });
});
    await supabase.from('branch_stock').upsert(stockToInsert);

    // 4. Seed Orders for the last 7 days
    console.log("🧾 Seeding historical orders...");
const orderToInsert = [];
branchIds.forEach(bId => {
    const profile = branchProfiles[bId];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Use branch-specific daily order count with some variation
        const baseOrders = profile.dailyOrders;
        const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3 variation
        const dailyOrders = Math.max(5, baseOrders + variation); // Minimum 5 orders
        
        for (let j = 0; j < dailyOrders; j++) {
            // Use branch-specific average order value
            const baseAmount = profile.avgOrderValue;
            const amountVariation = (Math.random() - 0.5) * 20; // ±10 variation
            const totalAmount = Math.max(10, baseAmount + amountVariation);
            
            orderToInsert.push({
                branch_id: bId,
                total_amount: Math.round(totalAmount * 100) / 100, // Round to 2 decimals
                status: 'Completed',
                created_at: date.toISOString()
            });
        }
    }
});
    await supabase.from('orders').insert(orderToInsert);


    console.log("🚦 Seeding traffic data...");
const trafficToInsert = [];
branchIds.forEach(bId => {
    const profile = branchProfiles[bId];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate traffic for each hour
        for (let hour = 6; hour <= 22; hour++) {
            let baseTraffic = 10; // Base traffic
            
            // Adjust based on peak hours
            if (profile.peakHours.includes(hour)) {
                baseTraffic = profile.size === 'large' ? 80 : profile.size === 'medium' ? 50 : 30;
            } else if (hour >= 9 && hour <= 17) { // Business hours
                baseTraffic = profile.size === 'large' ? 40 : profile.size === 'medium' ? 25 : 15;
            }
            
            // Add some random variation
            const variation = Math.floor(Math.random() * 20) - 10; // ±10
            const trafficCount = Math.max(0, baseTraffic + variation);
            
            trafficToInsert.push({
                branch_id: bId,
                hour: hour,
                count: trafficCount,
                date: date.toISOString().split('T')[0] // YYYY-MM-DD format
            });
        }
    }
});

await supabase.from('traffic').insert(trafficToInsert);

    console.log("✅ ESM Seed completed successfully with branch-specific data!");
}

seedData().catch(err => {
    console.error("❌ ESM Seed failed:", err);
    process.exit(1);
});
