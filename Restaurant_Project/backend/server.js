import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// A basic route to test the server
app.get('/', (req, res) => {
    res.send('Restaurant Backend is running!');
});

// Example route: Fetch all branches from Supabase
app.get('/api/branches', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('branches')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint for the IncomeBranchTracker component
app.get('/api/stats/income-branch-tracker', async (req, res) => {
    try {
        const { data: branches, error } = await supabase.from('branches').select('*');
        if (error) throw error;

        // Map real branches to our needed charting structure
        // Since we don't have real "income" in DB yet, we'll randomize it slightly
        // to show how it connects to real branch names.
        const chartData = branches.map((b, i) => {
            // Take the first letter or short name of the branch to fit on X-Axis
            const shortName = b.name ? b.name.substring(0, 3).toUpperCase() : `B${i}`;
            const mockIncome = 3000 + (Math.floor(Math.random() * 5000));
            const mockIncrease = `+${Math.floor(Math.random() * 20)}%`;
            return {
                id: b.id,
                branchName: shortName,
                fullName: b.name,
                income: mockIncome,
                increase: mockIncrease
            };
        });

        res.json(chartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint for the BranchManager component
app.get('/api/stats/branch-managers', async (req, res) => {
    try {
        // We'll look for users who are Branch_Managers
        const { data: managers, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Branch_Manager');
            
        if (error) throw error;
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
