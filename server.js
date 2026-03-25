import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

// Load environment variables if you have a .env file locally. Render will inject them securely on the cloud.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming request JSON and enable CORS (Cross Origin Requests)
app.use(cors());
app.use(express.json());

// Database connection logic for Supabase PostgreSQL
// Ensure your Render environment variable (SUPABASE_URL or DATABASE_URL)
// contains the Supabase PostgreSQL connection string (starts with postgresql://)
console.log('⌛ Waiting to establish a connection with the Supabase PostgreSQL Database...');

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL || process.env.DATABASE_URL,
    // Supabase requires SSL for external database connections
    ssl: {
        rejectUnauthorized: false
    }
});

// Create the contacts table if it doesn't already exist in the database
const initializeDB = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        if(process.env.SUPABASE_URL || process.env.DATABASE_URL) {
            await pool.query(createTableQuery);
            console.log('✅ Connected to Supabase PostgreSQL and ensured contacts table exists!');
        } else {
            console.log('⚠️ No SUPABASE_URL found. Please set your Supabase Connection String in the environment variables first.');
        }
    } catch (error) {
        console.error('❌ Database connection or table creation failed. Check your SUPABASE_URL connection string from Supabase.');
        console.error('Error details:', error.message);
    }
};

initializeDB();

// Endpoint handling POST /api/contact from the frontend
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Basic Validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill all fields' });
        }

        // Save incoming request details to Render PostgreSQL database
        const insertQuery = `
            INSERT INTO contacts (name, email, message)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [name, email, message];
        
        await pool.query(insertQuery, values);

        console.log(`✨ New portfolio message successfully received from: ${name}`);
        res.status(201).json({ success: true, message: 'Message saved successfully!' });
    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ success: false, message: 'Server error. Could not save message.' });
    }
});

// A basic check to see if server is active
app.get('/', (req, res) => {
    res.send('Portfolio Backend is running! Ready to accept Supabase PostgreSQL Connections.');
});

// Start the app listening to standard port
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Backend Server running on http://localhost:${PORT}`);
});
