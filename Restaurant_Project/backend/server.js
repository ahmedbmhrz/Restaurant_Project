import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routers
import branchesRouter from './routes/branches.js';
import statsRouter from './routes/stats.js';
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js';

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

// Route Mounting
app.use('/api', branchesRouter);
app.use('/api/stats', statsRouter);
app.use('/api', productsRouter); // Handles /api/products and /api/branch-stock
app.use('/api', usersRouter);    // Handles /api/users, /api/branch-managers, /api/users/:id/branch

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
