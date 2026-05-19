import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Fetch all Branch Managers
router.get('/branch-managers', async (req, res) => {
    try {
        const companyId = req.headers['x-company-id'];
        let query = supabase
            .from('users')
            .select('*')
            .in('role', ['Branch_Manager', 'Manager']);

        if (companyId) {
            query = query.eq('company_id', companyId);
        } else {
            query = query.eq('id', '00000000-0000-0000-0000-000000000000');
        }

        const { data: managers, error } = await query;
        if (error) throw error;
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create New User/Staff (Hiring)
router.post('/users', async (req, res) => {
    const { full_name, role, branch_id } = req.body;
    const companyId = req.headers['x-company-id'];
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ 
                full_name, 
                role, 
                branch_id, 
                company_id: companyId || null,
                hire_date: new Date().toISOString().split('T')[0]
            })
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Branch (Transfer Staff/Manager)
router.patch('/users/:id/branch', async (req, res) => {
    const { id } = req.params;
    const { branch_id, role } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ branch_id, role })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
