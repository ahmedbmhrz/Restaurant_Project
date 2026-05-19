import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Create New Product
router.post('/products', async (req, res) => {
    const { name, category, price, stock_quantity, branch_id, image_url } = req.body;
    const companyId = req.headers['x-company-id'];
    try {
        const { data: product, error: pError } = await supabase
            .from('products')
            .insert({ name, category, price, image_url, is_active: true, company_id: companyId || null })
            .select();
        
        if (pError) throw pError;
        const newProd = product[0];

        if (branch_id) {
            const { error: sError } = await supabase
                .from('branch_stock')
                .insert({ branch_id, product_id: newProd.id, stock_quantity });
            if (sError) throw sError;
        }

        res.json(newProd);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Product Info (Global)
router.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, image_url, is_active } = req.body;
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ name, price, image_url, is_active })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Branch Stock Quantity
router.patch('/branch-stock', async (req, res) => {
    const { branch_id, product_id, stock_quantity } = req.body;
    console.log("📥 RECEIVED PATCH /api/branch-stock:", { branch_id, product_id, stock_quantity });
    try {
        const { data, error } = await supabase
            .from('branch_stock')
            .upsert({ branch_id, product_id, stock_quantity })
            .select();
        if (error) {
            console.error("❌ SUPABASE UPSERT ERROR:", error);
            throw error;
        }
        console.log("✅ SUPABASE UPSERT SUCCESS:", data);
        res.json(data[0]);
    } catch (err) {
        console.error("❌ BACKEND PATCH ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
