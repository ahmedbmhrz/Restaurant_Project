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


app.get('/api/branches-page-data', async (req, res) => {
    try {
        const { data: branches, error: branchError } = await supabase
            .from('branches')
            .select('*')
        if (branchError) throw branchError;

        const { data: managers, error: managerError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'branch_manager')
        if (managerError) throw managerError;

        const mockIncomeData = {
            total: 128430,
            currency: "$",
            trend: "+15.2%",
            history: [
                { day: "Mon", amount: 15200 },
                { day: "Tue", amount: 18400 },
                { day: "Wed", amount: 16800 },
                { day: "Thu", amount: 21000 },
                { day: "Fri", amount: 24500 },
                { day: "Sat", amount: 28900 },
                { day: "Sun", amount: 26300 }
            ],
            breakdown: [
                { label: "Net Profit", value: "$98,200", color: "bg-emerald-500" },
                { label: "Tax (15%)", value: "$19,264", color: "bg-blue-500" },
                { label: "Tips/Fees", value: "$10,966", color: "bg-amber-500" }
            ]
        };
        const mockMenuData = {
            stats: {
                active: 142,
                outOfStock: 8,
                categories: 12,
                health: "94%"
            },
            highlightDish: {
                name: "Signature Wagyu Burger",
                price: "$24.50",
                rating: 4.9,
                orders: 1250,
                image: "🍔"
            },
            topItems: [
                { name: "Truffle Pasta", orders: 840, price: "$22.00", status: "Trending" },
                { name: "Lobster Bisque", orders: 620, price: "$18.50", status: "Popular" },
                { name: "Avocado Toast", orders: 510, price: "$14.00", status: "Steady" }
            ]
        };
        const mockOperationalData = {
            traffic: [
                { time: "8 AM", count: 45 },
                { time: "11 AM", count: 120 },
                { time: "2 PM", count: 85 },
                { time: "5 PM", count: 160 },
                { time: "8 PM", count: 210 },
                { time: "11 PM", count: 95 }
            ],
            departments: [
                { name: "Dining", share: 55, growth: "+8%", status: "Optimal" },
                { name: "Delivery", share: 30, growth: "+15%", status: "Peak" },
                { name: "Takeaway", share: 15, growth: "-2%", status: "Slow" }
            ],
            activity: [
                { id: 1, type: "Order", title: "New Order #4451", time: "2 mins ago", status: "Pending" },
                { id: 2, type: "Inventory", title: "Low Stock: Wagyu Beef", time: "15 mins ago", status: "Critical" },
                { id: 3, type: "Staff", title: "Sara clocked in", time: "45 mins ago", status: "System" }
            ]
        };

        res.json({
            branchesFromDb: branches,
            managers: managers,
            incomeData: mockIncomeData,
            menuData: mockMenuData,
            operationalData: mockOperationalData
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }



});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
