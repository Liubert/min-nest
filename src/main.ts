import 'reflect-metadata';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(8080, () => console.log('running on http://localhost:8080'));