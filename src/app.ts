import express from 'express';
import dotenv from 'dotenv';
import api from './api';
import pool from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

api(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('Closing connection pool');
    await pool.end();
    process.exit(0);
});