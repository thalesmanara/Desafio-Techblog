import { Router } from 'express';
import rotasAutenticacao from './modulos/autenticacao/rotasAutenticacao';
import rotasArtigos from './modulos/artigos/rotasArtigos';

const rotas = Router();

rotas.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

rotas.use('/api/autenticacao', rotasAutenticacao);
rotas.use('/api/artigos', rotasArtigos);

export default rotas;
