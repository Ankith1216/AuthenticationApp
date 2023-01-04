import express from 'express';
import dotenv from 'dotenv';
import api from './api';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

api(app);

export default app;