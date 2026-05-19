import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const query = req.query.q;
    const companyId = req.headers['x-company-id'];
    
    if (!query || query.trim() === '') {
        return res.json({ branches: [], users: [], products: [] });
    }

    try {
        const searchTerm = `%${query}%`;
        
        let branchesQuery = supabase.from('branches').select('id, name, address').ilike('name', searchTerm).limit(5);
        let usersQuery = supabase.from('users').select('id, full_name, role, branch_id').ilike('full_name', searchTerm).limit(5);
        let productsQuery = supabase.from('products').select('id, name, category, price').ilike('name', searchTerm).limit(5);
        
        if (companyId) {
            branchesQuery = branchesQuery.eq('company_id', companyId);
            usersQuery = usersQuery.eq('company_id', companyId);
            productsQuery = productsQuery.eq('company_id', companyId);
        } else {
            branchesQuery = branchesQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
            usersQuery = usersQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
            productsQuery = productsQuery.eq('company_id', '00000000-0000-0000-0000-000000000000');
        }

        const [
            { data: branches, error: branchError },
            { data: users, error: userError },
            { data: products, error: productError }
        ] = await Promise.all([
            branchesQuery,
            usersQuery,
            productsQuery
        ]);

        if (branchError) console.error("Branch search error:", branchError);
        if (userError) console.error("User search error:", userError);
        if (productError) console.error("Product search error:", productError);

        res.json({
            branches: branches || [],
            users: users || [],
            products: products || []
        });
    } catch (err) {
        console.error("Global search failed:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
