import express from 'express';
import dotenv from 'dotenv';
import api from './api';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

api(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});