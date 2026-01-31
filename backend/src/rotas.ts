import { Router } from 'express';

const rotas = Router();

rotas.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default rotas;
