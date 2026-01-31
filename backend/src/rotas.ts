import { Router } from 'express';
import rotasAutenticacao from './modulos/autenticacao/rotasAutenticacao';

const rotas = Router();

rotas.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

rotas.use('/api/autenticacao', rotasAutenticacao);

export default rotas;
