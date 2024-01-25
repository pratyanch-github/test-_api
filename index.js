import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import cors from 'cors';

// Import your route modules
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// dotenv.config();
const app = express();

// app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());

// Use your imported route modules
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.status(200).send('App up and running ✅');
});

app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
});
