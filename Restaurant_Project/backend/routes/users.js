import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Fetch all Branch Managers
router.get('/branch-managers', async (req, res) => {
    try {
        const { data: managers, error } = await supabase
            .from('users')
            .select('*')
            .in('role', ['Branch_Manager', 'Manager']);

        if (error) throw error;
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create New User/Staff (Hiring)
router.post('/users', async (req, res) => {
    const { full_name, role, branch_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ 
                full_name, 
                role, 
                branch_id, 
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
